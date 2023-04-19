import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import validator from 'validator';
import nodemailer from "nodemailer";

import prisma from "@/app/libs/prismadb";
import sanitizeHtml from "sanitize-html";

interface CreateUserRequestBody {
  email: string;
  name: string;
  password: string;
}

async function sendEmail(
  to: string,
  subject: string,
  text: string,
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM_ADDRESS,
    to,
    subject,
    text,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error) {
      if (error.code === "ECONNREFUSED") {
        console.error("Email server not available");
      } else if (error.code === "EAUTH") {
        console.error("Email authentication failed");
      } else if (error.code === "EENVELOPE") {
        console.error("Invalid email address in the envelope");
      } else if (error.code === "EMESSAGE") {
        console.error("Invalid email message");
      }
    } else {
      console.error(error);
    }
  }
}


async function createUser(email: string, name: string, password: string) {

  const isEmailValid = validator.isEmail(email); // Check if the email is valid using the validator library
  const isNameValid = validator.matches(name, /^[a-zA-Z\s']+$/) && validator.isLength(name, { min: 3, max: 254 }); // Check if the name is valid using the validator library
  const isPasswordValid = validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
  }) && validator.isLength(password, { min: 8, max: 254 });

  if (!isEmailValid) {
    throw new Error("Invalid email address");
  } else if (!isNameValid) {
    throw new Error("Invalid name field");
  } else if (!isPasswordValid) {
    throw new Error("Invalid password field");
  } else {
    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a verification code
    const verificationCode = Math.floor(Math.random() * 900000) + 100000;

    // Sanitize the user data
    const sanitizedEmail = sanitizeHtml(email);
    const sanitizedName = validator.escape(name);

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: sanitizedEmail,
      },
    });
    if (existingUser) {
      throw new Error("Email already exists");
    }

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        email: sanitizedEmail,
        name: sanitizedName,
        hashedPassword,
        verificationCode
      },
    });

    // Return the user data
    return user;
  }
}

export async function POST(request: Request) {
  try {
    // Parse the request body as JSON
    const body = await request.json() as CreateUserRequestBody;

    // Validate the request body
    const { email, name, password } = body;
    if (!email || !name || !password) {
      throw new Error("Invalid request body");
    }

    // Create the user
    const user = await createUser(email, name, password);

    // Send welcome email to the user
    const subject = "Welcome to Airbnb Clone!";
    const text = `Hi ${name}! It's good to have you aboard!`;
    await sendEmail(email, subject, text);

    // Return the user data as JSON
    return NextResponse.json(user, { status: 201 }); // Created status code
  } catch (error) {
    console.error(error);
    const typedError = error as Error & { code?: string }; // Typecast the error to include the code property

    // Return an appropriate error response
    if (typedError.code === "P2002") { // Unique constraint violation error
      return new NextResponse("Email already exists", { status: 409 }); // Conflict error
    } else if (typedError.message.startsWith("Invalid")) { // Validation error from the createUser function
      return new NextResponse(typedError.message, { status: 400 }); // Bad request error
    }

  }
}