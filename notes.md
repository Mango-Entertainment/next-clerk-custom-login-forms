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

Remove that code and keep a div or fragment for nowInstall and setup Clerk

## Create a git repo and push up your code

## Deploy your project on Vercel (make an account if you don't have one)

## Make an account on clerk.com
Run this command in your terminal
`npm install @clerk/nextjs`

When you’re logged into your clerk account, look at the left hand side of your dashboard under developers.

There's a button that says API Keys. 
Click that and copy your `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` into your `.env.local` and wherever you're deploying your project (we'll deploy ours with Vercel)

!! be sure you have your `.env.local` in your `.gitignore` !!

Wrap your app in the <ClerkProvider>

Under app/page.tsx we will wrap our app in the provider.

``` javascript
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
...{
    export default authMiddleware({
  publicRoutes: ['/'],
})
 
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
}
```

Next we want to route users to sign-up and sign-in components we create.

Create a sign-up component

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

Create a sign-in component

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

In that page.tsx, create your sign-in component

```javascript


```