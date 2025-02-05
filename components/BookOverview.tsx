import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import BookCover from "./BookCover";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import { users } from "@/database/schema";
import BorrowBook from "./BorrowBook";

// ALONGSIDE BOOK PROPERTIES WE WILL ALSO BE ACCEPTING USER IDS
interface Props extends Book {
  userId: string;
}

const BookOverview = async ({
  title,
  author,
  genre,
  rating,
  totalCopies,
  availableCopies,
  description,
  coverColor,
  coverUrl,
  id,
  userId,
}: Props) => {
  /*
   * STATUS CAN BE PENDING | APPROVED | REJECTED
   * FETCHING THE USER DATA
   */
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  // console.log(coverUrl);
  // IF USER DOESN'T EXIST THEN WE CAN'T BORROW
  // !THIS IS NOT REQUIRED SINCE IF WE CAN'T FETCH THE USER WE CAN'T FIGURE OUT THE BORROWING ELIGIBILITY
  // if (!user) return null;
  // ?HENCE HIDING THE BUTTON IS MORE APPROPRIATE THAN HIDING THE WHOLE THING

  const borrowingEligibility = {
    // BOOLEAN VARIABLE
    // CHECK STATUS OF THE VARIABLE
    isEligible: availableCopies > 0 && user?.status === "APPROVED",
    message:
      availableCopies <= 0
        ? "Book is not available"
        : "You are not eligible to borrow this book",
  };
  return (
    <section className="book-overview">
      <div className="flex flex-1 flex-col gap-5">
        <h1>{title}</h1>

        {/* INFO ABOUT THE BOOK */}
        <div className="book-info">
          <p>
            By <span className="font-semibold text-light-200">{author}</span>
          </p>

          <p>
            Category:{" "}
            <span className="font-semibold text-light-200">{genre}</span>
          </p>

          <div className="flex flex-row gap-1">
            <Image src="/icons/star.svg" alt="star" width={22} height={22} />
            <p>{rating}</p>
          </div>
        </div>

        <div className="book-copies">
          <p>
            Total Books <span>{totalCopies}</span>
          </p>

          <p>
            Available Books <span>{availableCopies}</span>
          </p>
        </div>
        {/* DESCRIPTION */}
        <p className="book-description">{description}</p>

        {/* IF USER EXISTS SHOW THE BORROWED BOOK */}
        {user && (
          <BorrowBook
            bookId={id}
            userId={userId}
            borrowingEligibility={borrowingEligibility}
          />
        )}
      </div>

      <div className="relative flex flex-1 justify-center">
        <div className="relative">
          <BookCover
            variant="wide"
            className="z-10"
            coverColor={coverColor}
            coverImage={coverUrl}
          />

          <div className="absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden">
            <BookCover
              variant="wide"
              coverColor={coverColor}
              coverImage={coverUrl}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookOverview;
