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

# Chapter 4:
Creating utility to only allow unauth user to sign-in page, designing interactive chat interface with sidebar,header & theming

Step : create modules folder & inside that create chat, auth folder

Step: Inside auth, create actions/index.ts to write auth functionality

Step: Inside auth, create UserButton components/user-btn.jsx
npm i lucide-react

Step: Use userbtn inside root page.tsx

Step : Create a utitlity of requireAuth or notreqAuth in index.js to protect specific route

Step : Create root route grp and add layout.tsx file and Homepage page.tsx file

Step : Now go to (root) layout.tsx file to implement sidebar & add ChatSidebar component

Step: Now create that chat sidebar comp inside chat/comp

Step: Create theme-provider inside comp/providers/ and then wrap Root layout file inside it

Step : Create heading compo which contain mode-toogler in root comp and use it inside (root)/layout

Step: Also create a mode-toggle comp isnide root comp

# Chapter 5:
Implementing Model Selectn: Openrouter(unified interface for LLM's), Fetching models and ui setup

Step 1: Create openrouter account and get api and paste into env file

Step 2: Implement backend route to fetch all free ai models inside api/ai/get-models/route.ts 

Step 3: Setup tanstack query -> npm i @tanstack/react-query

Step 4: Create query provider inside comp/providers -> wrap layout file inside it

Step 5: Create home page view by importing Chat msg view comp in home page

Step 6: Create ChatMessageView comp inside chat/comp/chat-view/chat-message-view.tsx

Step 7: Create another chat welcome tab comp there

Step 8: Create a comp of constants inside chat welcome tab comp

Step 9: Create another comp for chat message form in chat-view/ and use it in chat msg view comp

Step 10: Create a chat/hook folder and inside that create use-ai-model.ts hook to use ai models

Step 11: Create a model selector comp in chat-view/comp

# Chapter 6: End-to-End Chat setup
Backend Schema, API and UI hooks

> FLow: User init chat --> useCreateChat hook trigger --> a server action -> to create msg into db --> we redirect to that specific chat id page --> then that msg trigger --> ai agent --> which will generate response

> Relationship table 

| Relationship | From | To | Type |
| :---: | :---: | :---: | :---: |
| User own Chats | User | Chat | 1:N(1 to many) |
| Chats contains Messages | Chat | Messages | 1:N(1 to many) |
| Message has Attachements | Message | Attachement | 1:N(1 to many) |
| User has Sessions | User | Session | 1:N(1 to many) |
| User has Accounts | User | Account | 1:N(1 to many) |


Step 1: Create chat model and message model in schema file
And a chat can have multiple msgs and a chat is owned by a user
And to identify which msg is of user and which is of ai, we use msg role

Step 2: run migrate and generate cmd

Step 3: Now create server action as whenevr user first init chat -> we want to do 2 things: create a chat with msgs and another is or initialising it inside chat/actn/index.ts

Step 4: Create hooks related to chat in chat/hooks/use-chats.ts

# Chapter 7: Building chat sidebar
Data fetch and component design

Step 1: Go to chat sidebar comp and start upgrading the code for better ui and functionality

Step 2: Create chat id page as (root)/chat/chatID

# Chapter 8 : Active Chat Sidebar Items
Dynamic Page & Messaging Components

Step 1: Start creating chatId page

Step 2: Create a message-view-form comp inside chat/comp to show msg form or chat form

Step 3: install ai sd elements as : npx shadcn@latest add @ai-elements/all or from docs


# Chapter 9: Advanced Chat Api Development
Streaming, Message Conversion and Persistence

Flow : Frontend -> when hit send msg -> create POST req and hit an endpt /api/chat contains(chatId, msgs, model, skipUser)  -> Then we go to Route handler -> and perform these actns  ->  1. where we load old msg -> 2. then merge old + new(UI format)  ->  3. Convert to model format(in which format ai accept msgs)  ->  4. then streamText() means send data chunk by chunk   ->  these stram msg sent to frontend in form of streaming Token  -> And when entire Stream or msg is finished  ->  5. Save it(user & assistant msg) to db  ->  so when next time user comes, it sees all msgs


Step 1: Install ai sdk and open router inside your project as :
npm install ai
npm install @openrouter/ai-sdk-provider

Step 2: Create chat route inside api/chat

Step 3: Create prompt.ts file inside lib which contains prompts in structured way which will attch with user msgs providing better context and understanding to AI