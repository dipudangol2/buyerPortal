import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT = 12;
const MAX_AGE = 3 * 24 * 60 * 60 ;

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT);
};

export const comparePasswords = async (plain: string, hashed: string): Promise<boolean> => {
    return await bcrypt.compare(plain, hashed);
};

export const createToken = (email: string, userId: string | number) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return jwt.sign({ email, userId }, jwtSecret, {
        expiresIn: Math.floor(MAX_AGE ), 
    });
};
