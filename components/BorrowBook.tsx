"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { borrowBook } from "@/lib/actions/book";

interface Props {
  bookId: string;
  userId: string;
  borrowingEligibility: {
    isEligible: boolean;
    message: string;
  };
}

const BorrowBook = ({
  bookId,
  userId,
  borrowingEligibility: { isEligible, message },
}: Props) => {
  // GET USER INTO ANOTHER PAGE AFTER THEY BORROW
  const router = useRouter();

  // HANDLE LOADING STATE OF BORROW FUNCTION
  const [borrowing, setBorrowing] = useState(false);

  // EXECUTED WHEN WE CLICK ON THE BUTTON
  const handleBorrowBook = async () => {
    if (!isEligible) {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }

    // IF WE PASS IF STATEMENT, MEANING ELIGIBLE
    // START THE LOADING
    setBorrowing(true);

    try {
      // GET A RESULT FROM THE SERVER ACTION WE CREATED
      const result = await borrowBook({ bookId, userId });

      if (result.success) {
        toast({
          title: "Success",
          description: "Book borrowed successfully",
        });
        // router.push("/my-profile");
        router.push("/");
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while borrowing the book",
        variant: "destructive",
      });

      // CAN ADD THIS SINCE NO MATTER IF IT SUCCEEDS OR FAILS WILL SET BORROWING BACK TO FALSE TO STOP THE LOADING
    } finally {
      setBorrowing(false);
    }
  };

  return (
    <Button
      className="book-overview_btn"
      onClick={handleBorrowBook}
      disabled={borrowing}
    >
      <Image src="/icons/book.svg" alt="book" width={20} height={20} />
      <p className="font-bebas-neue text-xl text-dark-100">
        {borrowing ? "Borrowing..." : "Borrow Book"}
      </p>
    </Button>
  );
};

export default BorrowBook;
