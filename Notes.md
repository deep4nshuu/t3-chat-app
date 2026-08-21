# Chapter 1: Installing nextj & shadcn ui

Step 1: npx create-next-app@latest

Step 2: npx shadcn@latest init --preset bKsI1x32 --template next

Step 3: npx shadcn@latest add

# Chapter 2:
Setting up db with prisma and neon db

Step 1: Install prisma as : npm i prisma @prisma/client pg @prisma/dapter-pg

Step 2: npx prisma init

Step 3: Set up db -> we can create docker compose file(file->package.json->env) and add docker db url or We can add Neon db url

Step 4: Create db.ts utility in lib folder

Step 5: Create a test model in prisma.schema

Step 6: npx prisma generate and migrate dev

# Chapter 3:
Adding better-auth authenticatn and custom auth pages -> follow better-auth docs

Step 1: npm install better-auth

Step 2: Add better-auth secret and url in env file

Step 3: Create auth.ts file inside lib and configure db there

Step 4: Add socialProviders like github inside auth file and get their secrets

Step 5: to get github secret -> go to github -> developer setting -> outh app -> create one using localhost url & better auth github redirect url(from docs)

Step 6: Create db table using: npx auth@latest generate 

Step 7: Create a mount handler to handle api's as: app/api/auth/[...all]/route.ts and paste code

Step 8: Create client instance(client-side library helps you interact with the auth server.) in lib/auth.ts

Step 9: Create sign-in page as: (auth)/sign-in/page & design a little bit and a layout file for route grp

Step 10: run migrate and generate cmd as not done for auth schema