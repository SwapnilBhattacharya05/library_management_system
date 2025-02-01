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
      <form
        action={async () => {
          // THIS WILL BE CALLED DIRECTLY ON THE SERVER EVEN THOUGH IT'S A CLICK
          "use server";
          await signOut();
        }}
        className="mb-10"
      >
        <Button>Logout</Button>
      </form>
      <BookList title="Borrowed Books" books={sampleBooks} />
    </>
  );
};

export default page;
