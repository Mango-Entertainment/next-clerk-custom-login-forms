"use client";
import {UserButton, useUser} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const {isSignedIn, user, isLoaded} = useUser();

  return (
    <div className="text-center flex flex-col gap-4 content-center h-screen items-center">
      <h1 className="text-2xl mt-4">Hello!</h1>
      {isSignedIn && <h1 className="text-2xl">You are logged in!</h1>}
      <div className="flex align-center justify-center">
        {!isSignedIn ? (
          <div className="flex gap-2">
            <div className="px-3 py-2 mb-6 text-xl font-light text-white hover:text-blue-900 hover:bg-white bg-slate-700 rounded-md">
              <Link href="/sign-up" className="self-center">
                Signup
              </Link>
            </div>
            <div className="px-3 py-2 mb-6 text-xl font-light text-white hover:text-blue-900 hover:bg-white bg-slate-700 rounded-md">
              <Link href="/sign-in" className="self-center">
                Login
              </Link>
            </div>
          </div>
        ) : (
          <UserButton afterSignOutUrl="/" />
        )}
      </div>
    </div>
  );
}
