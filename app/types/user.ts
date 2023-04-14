export type User = {
    id: string;
    name: string | null; // make the name property nullable
    email: string;
    emailVerified: Date | null;
    image: string | null;
    hashedPassword: string | null;
    verificationCode: number | null;
    createdAt: Date;
    updatedAt: Date;
    favoriteIds: string[];
};
