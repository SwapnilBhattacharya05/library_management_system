import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  // coerce = TAKE A STRING AND CONVERT IT INTO A NUMBER
  universityId: z.coerce.number(),
  universityCard: z.string().nonempty("University Card is required"),
  password: z.string().min(8),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const bookSchema = z.object({
  // min => NO LESS THAN <number> CHARACTERS
  // max => NO MORE THAN <number> CHARACTERS
  title: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(1000),
  author: z.string().trim().min(2).max(100),
  genre: z.string().trim().min(2).max(50),
  // coerce = TAKE A STRING AND CONVERT IT INTO A NUMBER
  rating: z.coerce.number().min(1).max(5),
  // positive = NO LESS THAN 0
  // lte = LOWER THAN OR EQUAL
  totalCopies: z.coerce.number().int().positive().lte(10000),
  coverUrl: z.string().nonempty(),
  // TO BE ABLE TO CHOOSE HOW THE COVERS OF BOOK WILL LOOK LIKE
  // SHOULD BE A VALID HEXADECIMAL COLOR
  coverColor: z
    .string()
    .trim()
    // MUST START WITH # AND CONTAIN NUMBERS FROM [0-9] AND LETTERS A - F AND MUST BE 6 CHARACTERS
    .regex(/^#([0-9A-F]{6})$/i),
  videoUrl: z.string().nonempty(),
  summary: z.string().trim().min(10),
});
