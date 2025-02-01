import { auth } from "@/auth";
import Header from "@/components/Header";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

/* 
* TELLING TYPESCRIPT WE WANT TO GET SOME CHILDREN THROUGH PROPS HERE 
* AND ARE OF TYPE REACTNODE

*/
const layout = async ({ children }: { children: ReactNode }) => {
  // IF NO SESSION REDIRECT TO SIGN IN PAGE
  const session = await auth();
  if (!session) redirect("/sign-in");
  return (
    <main className="root-container">
      <div className="mx-auto max-w-7xl">
        <Header session={session} />
        <div className="mt-20 pb-20">{children}</div>
      </div>
    </main>
  );
};

export default layout;
