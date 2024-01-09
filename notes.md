# Nextjs with your own login forms using Clerk

---

## Setup a new project
Create a new project in the terminal with nextjs
Run this command: `npx create-next-app@latest`

Then you need to install the following packages:
create-next-app@14.0.4
Ok to proceed? (y) y
Give your project a name. We’ll call ours next-clerk-custom-login-forms

```
Would you like to use TypeScript?  Yes
Would you like to use ESLint?  Yes
Would you like to use Tailwind CSS? Yes
Would you like to use `src/` directory?  No
Would you like to use App Router? (recommended) Yes
Would you like to customize the default import alias (@/*)? No
```

Your project will then finish setting up
Change directories into your project by running this command in your terminal `cd your-project-name`
For our project we run `cd next-clerk-custom-login-forms`
Open it in vscode by then running this command `code .`
Install dependencies from the root folder of your project by running `npm i`

## Remove the nextjs boilerplate
inside the app folder there is a file called page.tsx
This has all the code that is rendered in the boilerplate

Remove that code and keep a div or fragment for now

## Initalize git and push up your code Github

```
echo "# hi" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/AlexVCS/hi.git
git push -u origin main
```

## Deploy your project on Vercel (make an account if you don't have one)

On your Vercel dashboard, go to Add new and select project.

From there you can import your Git repository and just remember to update your environment variables on Vercel too!

## Make an account on clerk.com

Once created, click add application from your Clerk dashboard.

Type in your application name. Our login will allow you to authenticate with email, Google, or Github, select those (and others) services if you'd like.

## Setup Clerk in your project
Run this command in your terminal
`npm install @clerk/nextjs`

When you’re logged into your clerk account, look at the left hand side of your dashboard under developers.

There's a button that says API Keys. 
Click that and copy your `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` into your `.env.local` and wherever you're deploying your project (we'll deploy ours with Vercel)

!! be sure you have your `.env.local` in your `.gitignore` !!

Wrap your app in the <ClerkProvider>

Under app/page.tsx we will wrap our app in the provider.

``` javascript
// app/page.tsx
...{
  return (
    <ClerkProvider>
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    </ClerkProvider>
  )
}
```

Create a middleware file

Clerk can require a login to access your app, certain pages, or allow any user access.

Create a middleware.ts file at the root of your project.

From the terminal, at the root of your project run:

```touch middleware.ts```

Open middleware.ts. For this project we'll allow access to users but also have authentication

``` javascript
// middleware.ts
import {authMiddleware} from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
//   publicRoutes: ["/"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

```

### Now you should be rendering out of the box Clerk auth components

Open your app locally by running this command
`npm run dev`

You should see a login page that looks like this:


![The San Juan Mountains are beautiful!](/public/screenshots/boilerplateLogin.png "Clerk Boilerplate UI")

---

Next we want to route users to sign-up and sign-in components we create.

## Setup components folder

Inside the app folder, create a new folder for components.

Run this terminal command from the root of the project:
```bash
cd app
mkdir components
```

Inside the components folder, create three components:
```bash
cd components
touch SignupForm.tsx SigninForm.tsx VerifyForm.tsx
```

## Create a sign-up component

Inside your app folder, create a new folder called sign-up

In your terminal run
```bash
cd app
mkdir sign-up
```

Within that sign-up folder, create another folder
`mkdir [[...sign-up]]`

Inside the new [[...sign-up]] folder, create a page.tsx file
`touch page.tsx`

In that page.tsx, create your sign-up component

```javascript
"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import SignupForm from "@/app/components/SignupForm";
import VerifyForm from "@/app/components/VerifyForm";

const Signup = () => {
  const {isLoaded, signUp, setActive} = useSignUp();
  const [clerkError, setClerkError] = useState("");
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

  return (
    <>
      {!verifying ? 
        (<SignupForm signUpWithEmail={signUpWithEmail} clerkError={clerkError} />) : 
        (<VerifyForm handleVerify={handleVerify} code={code} setCode={setCode} />)
      }
    </>
  )
      
};

export default Signup;

```

Now we'll create SignupForm.tsx, VerifyForm.tsx, and SigninForm.tsx.

## Create the SignupForm

Head back to the components folder and the SignupForm.tsx file.

The code will be as follows:

```javascript
import Link from "next/link";

interface SignUpFormProps {
  signUpWithEmail: ({emailAddress, password }:{emailAddress: string, password: string}) => void
  clerkError: string
}

const SignupForm = ({signUpWithEmail, clerkError}: SignUpFormProps) => {
  return (
    <div className="justify-center mt-12 grid justify-items-center md:mt-20">
      <div className="h-auto bg-entertainment-semi-dark-blue rounded-xl md:rounded-3xl w-80 md:w-96">
        <div className="p-6 md:p-8">
          <h1 className="mb-6 text-3xl font-light text-entertainment-pure-white">
            Sign Up
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const target = e.target as typeof e.target & {
                email: {value: string};
                password: {value: string};
              };
              const email = target.email.value;
              const password = target.password.value;
              signUpWithEmail({emailAddress: email, password: password});
            }}
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

export default SignupForm
```

## Create the VerifyForm

Clerk has users the signup with email and password enter a verficiation code from their email.

Here's the code for the VerifyForm:

```javascript
import { FormEvent } from "react"

interface VerifyFormProps {
    handleVerify: (e: FormEvent) => void
    code: string
    setCode: (value: string) => void
}

const VerifyForm = ({handleVerify, code, setCode}: VerifyFormProps) => {
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

export default VerifyForm
``` 

## Create the SigninForm



## Create a sign-in component

Now we will run the same steps for our sign-in component

In your terminal run
```bash
cd app
mkdir sign-in
```

Within that sign-in folder, create another folder
`mkdir [[...sign-in]]`

Inside the new [[...sign-in]] folder, create a page.tsx file
`touch page.tsx`

Clerk has documentation about creating custom flows for sign-up and sign-in. [Be sure to check it out](https://clerk.com/docs/custom-flows/overview#custom-flows) as it helped us implement these components!

In that page.tsx, create your sign-in component

```javascript


```

## Test your signup component

Add these environment variables to your .env.local:
```
// .env.local
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

This will route the pages to the custom components. Do this on Vercel or wherever your app is deployed too. If you're running your project locally be sure to **stop** the local server and restart it again.

Wherever your have the project running locally, stop and restart the server.

Run this to stop the server:

Mac:
`cmd + c`

Windows:
`control + c`

Restart it with this command:
`npm run dev`

In your middleware file, bring back the line in the authMiddleware function (it's on line 7). Your file will now look like this:

```javascript
// middelware.ts
...
export default authMiddleware({
  publicRoutes: ["/"],
});
...
```

Go back to the page.tsx file you removed the Next boilerplate from initially.

The file should now look like this:

```javascript
// app/page.tsx
```

