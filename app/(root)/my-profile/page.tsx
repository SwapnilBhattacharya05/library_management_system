import { signOut } from "@/auth";
import BookList from "@/components/BookList";
import { Button } from "@/components/ui/button";
import { sampleBooks } from "@/constants";
import React from "react";

const page = () => {
  return (
    <>
      {/* TO KEEP THIS PAGE SERVER RENDERED */}
      {/* NEXTJS AND REACT NEW SERVER FORMS */}

      <BookList title="Borrowed Books" books={sampleBooks} />
    </>
  );
};

export default page;
