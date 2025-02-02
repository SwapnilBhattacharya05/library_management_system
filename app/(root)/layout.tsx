import { auth } from "@/auth";
import Header from "@/components/Header";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { after } from "next/server";
import React, { ReactNode } from "react";

/* 
* TELLING TYPESCRIPT WE WANT TO GET SOME CHILDREN THROUGH PROPS HERE 
* AND ARE OF TYPE REACTNODE

*/
const layout = async ({ children }: { children: ReactNode }) => {
  // IF NO SESSION REDIRECT TO SIGN IN PAGE
  const session = await auth();
  if (!session) redirect("/sign-in");

  /*
   * MAKE A CHECK AFTER THEY ARE SIGNED IN
   * after ENSURES THAT IT NEVER BLOCKS THE UI
   * IT WILL KNOCK DOWN NUMBER OF MUTATION CALLS TO THE DATABASE
   */
  after(async () => {
    // !IF NO SESSION OF THE USER EXISTS, EXIT OUT OF IT
    if (!session?.user?.id) return; // ADDITIONAL CHECK, NOT NECESSARY

    // DON'T UPDATE ALWAYS AND ONLY UPDATE ONCE A DAY
    // GET THE USER AND SEE IF THE LAST ACTIVITY DATE IS TODAY
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session?.user?.id))
      .limit(1);

    if (user[0].lastActivityDate === new Date().toISOString().slice(0, 10))
      // !EXIT OUT OF THE FUNCTION AND DON'T UPDATE
      return;

    // ?UPDATE DATABASE IF USER DOES EXIST
    await db
      .update(users)
      // SLICE TAKES THE DAY MONTH AND YEAR WITHOUT THE TIME IN THIS CASE
      .set({ lastActivityDate: new Date().toISOString().slice(0, 10) })
      .where(eq(users.id, session?.user?.id));
  });

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
