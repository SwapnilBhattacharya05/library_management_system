"use server";
/*
 * TELLS THIS FILE TO ONLY BE CALLED ON THE SERVER SIDE
 * FOR SECURITY REASONS
 */

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { signIn } from "@/auth";
import { headers } from "next/headers";
import ratelimit from "@/lib/ratelimit";
import { redirect } from "next/navigation";
import { workflowClient } from "../workflow";
import config from "@/lib/config";

// Pick => PICKS ONLY SOME OF THE TYPES THAT WILL BE THERE
// IN THIS CASE IT SHOULD ONLY BE EMAIL AND PASSWORD SINCE sign-in
// Pick => AVAILABLE IN TYPESCRIPT
export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">
) => {
  const { email, password } = params;

  // GET THE CURRENT IP ADDRESS
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";

  // LIMIT THE NUMBER OF REQUESTS PER IP
  const { success } = await ratelimit.limit(ip);

  if (!success) return redirect("/too-fast");
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // IF SIGNIN IS UNSUCCESSFUL
    if (result?.error) return { success: false, error: result.error };

    // IF SIGNIN IS SUCCESSFUL
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Signin error" };
  }
};
export const signUp = async (params: AuthCredentials) => {
  const { fullName, email, password, universityId, universityCard } = params;

  // GET THE CURRENT IP ADDRESS
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";

  // LIMIT THE NUMBER OF REQUESTS PER IP
  const { success } = await ratelimit.limit(ip);

  if (!success) return redirect("/too-fast");

  // CHECK IF THE USER ALREADY EXISTS IN THE DATABASE
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { success: false, message: "User already exists" };
  }
  // IF USER DOESN'T EXIST ALREADY HASH THE PASSWORD
  // 10 => SALT, THE COMPLEXITY IT WILL HAVE
  const hashedPassword = await hash(password, 10);

  try {
    // INSERT THE USER INTO THE DATABASE
    await db.insert(users).values({
      fullName,
      email,
      password: hashedPassword,
      universityId,
      universityCard,
    });

    // trigger THE WORKFLOW WHEN THE USER IS CREATED
    await workflowClient.trigger({
      // url POINTING TO THE ROUTE OF THE WORKFLOW
      url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
      body: {
        email, // email WE WANT TO SEND TO
        fullName, // NAME OF THE USER
      },
    });

    await signInWithCredentials({ email, password });
    return { success: true };
  } catch (error) {
    console.log(error, "Signup error");
    return { success: false, error: "Signup error" };
  }
};
