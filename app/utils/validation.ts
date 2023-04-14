export function validateUserInput(
    name: string | undefined,
    email: string | undefined,
    password: string | undefined
): string | null {
    if (!name || !email || !password) {
        return "All fields are required";
    }

    if (name.trim().length < 3) {
        return "Name must be at least 3 characters";
    }

    if (!isValidEmail(email)) {
        return "Email is invalid";
    }

    if (password.length < 8) {
        return "Password must be at least 8 characters";
    }

    return null;
}

function isValidEmail(email: string): boolean {
    // A simple regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
