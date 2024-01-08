# Nextjs with your own login forms using Clerk

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

Next we want to route users to sign-up and sign-in components we create.

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


```

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
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>Hello!</h1>
      <div className="bg-red-500 text-white text-center w-14 h-7 mr-4 rounded-md md:h-8 md:mr-6 lg:mr-0 lg:mb-8 flex align-center justify-center">
        <Link href="/sign-up" className="self-center">
          Signup
        </Link>
      </div>
      <UserButton />
    </div>
  );
}
```