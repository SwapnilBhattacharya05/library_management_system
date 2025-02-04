import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">All Books</h2>

        {/* asChild WILL MAKE THE BUTTON A LINK */}
        <Button className="bg-primary-admin" asChild>
          <Link href="/admin/books/new" className="text-white">
            + Create a New Book
          </Link>
        </Button>
      </div>
      
      {/* DASHBOARD TABLE */}
      <div className="mt-7 w-full overflow-hidden">
        <p>TABLE</p>
      </div>
    </section>
  );
};

export default page;
