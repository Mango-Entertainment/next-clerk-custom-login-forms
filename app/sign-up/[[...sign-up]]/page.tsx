"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";

const Signup = () => {
  const {isLoaded, signUp, setActive} = useSignUp();
  const [clerkError, setClerkError] = useState(null);
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter();
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");

  const signUpWithEmail = async ({
    emailAddress,
    password,
  }: {
    emailAddress: string;
    password: string;
  }) => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      });
      // send the email.
      await signUp.prepareEmailAddressVerification({strategy: "email_code"});

      // change the UI to our pending section.
      setVerifying(true);
    } catch (err: any) {
      setClerkError(err.errors[0].message);
    }
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }

      if (completeSignUp.status === "complete") {
        await setActive({session: completeSignUp.createdSessionId});
        router.push("/");
      }
    } catch (err) {
      console.log("Error:", JSON.stringify(err, null, 2));
    }
  };

  if (verifying) {
    return (
      <div className="flex justify-center mt-12 grid justify-items-center md:mt-20">
        <div className="h-auto bg-entertainment-semi-dark-blue rounded-xl md:rounded-3xl w-80 md:w-96">
          <div className="p-6 md:p-8">
            <h1 className="mb-6 text-3xl font-light text-entertainment-pure-white">
              Verification Code
            </h1>
            <form onSubmit={handleVerify}>
              <input
                value={code}
                className="block w-full pb-4 pl-4 mb-3 text-sm font-light bg-transparent border-0 border-b-2 h-37 border-entertainment-greyish-blue text-entertainment-pure-white caret-entertainment-red focus:border-entertainment-pure-white"
                id="code"
                name="code"
                onChange={(e) => setCode(e.target.value)}
              />

              <button
                className="w-full h-12 mb-6 text-sm font-light text-entertainment-pure-white hover:text-entertainment-dark-blue hover:bg-entertainment-pure-white bg-entertainment-red rounded-md"
                type="submit"
              >
                Complete sign up
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="justify-center mt-12 grid justify-items-center md:mt-20">
      <div className="h-auto bg-entertainment-semi-dark-blue rounded-xl md:rounded-3xl w-80 md:w-96">
        <div className="p-6 md:p-8">
          <h1 className="mb-6 text-3xl font-light text-entertainment-pure-white">
            Sign Up
          </h1>
          <form
            onSubmit={(e) => {
                e.preventDefault()
                const target = e.target as typeof e.target & {
                    email: {value: string}
                    password: {value: string}
                }
                const email = target.email.value
                const password = target.password.value
              signUpWithEmail({emailAddress: email, password: password})
            }
            }
          >
            <input
              name="email"
              className="block w-full pb-4 pl-4 mb-3 text-sm font-light bg-transparent border-0 border-b-2 h-37 border-entertainment-greyish-blue text-entertainment-pure-white caret-entertainment-red focus:border-entertainment-pure-white"
              placeholder="Email address"
              type="email"
              required
            />
            <input
              name="password"
              className="block w-full pb-4 pl-4 mb-3 text-sm font-light bg-transparent border-0 border-b-2 h-37 border-entertainment-greyish-blue text-entertainment-pure-white caret-entertainment-red focus:border-entertainment-pure-white"
              placeholder="Password"
              type="password"
              required
            />
            <h2 className="text-entertainment-red mb-8">
              {clerkError && <p>{clerkError}</p>}
            </h2>
            <button
              className="w-full h-12 mb-6 text-sm font-light text-entertainment-pure-white hover:text-entertainment-dark-blue hover:bg-entertainment-pure-white bg-entertainment-red rounded-md"
              type="submit"
            >
              Create an account
            </button>
          </form>
          <p className="text-sm font-light text-center text-entertainment-pure-white">
            Already have an acccount?
            <Link className="ml-2 text-entertainment-red" href="/sign-in">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;