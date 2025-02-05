"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";

export const borrowBook = async (params: BorrowBookParams) => {
  const { bookId, userId } = params;

  try {
    // NEW MUTATION TO THE DATABASE
    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book.length || book[0].availableCopies <= 0) {
      return {
        success: false,
        error: "Book is not available",
      };
    }

    const dueDate = dayjs().add(7, "day").toDate().toDateString();

    // INSERT SOMETHING INTO THE DATABASE BUT INTO A COMPLETELY NEW TABLE CALLED borrowRecords
    // TABLE -> borrowRecords
    // !await SINCE WE ARE CREATING A NEW RECORD IN THE DATABASE
    const record = await db.insert(borrowRecords).values({
      userId,
      bookId,
      dueDate,
      status: "BORROWED",
    });

    // MUTATE THE ORIGINAL BOOKS
    await db
      .update(books)
      // SET NUMBER OF AVAILABLE COPIES
      .set({
        // SINCE SOMEBODY BORROWED ONE INSTANCE OF THAT BOOK
        availableCopies: book[0].availableCopies - 1,
      })
      .where(eq(books.id, bookId));

    return { success: true, data: JSON.parse(JSON.stringify(record)) };
  } catch (error) {
    console.log(error);

    return { success: false, error: "Error occured while borrowing the book" };
  }
};
