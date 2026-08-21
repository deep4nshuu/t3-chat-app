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