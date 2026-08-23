import { currentUser } from "@/modules/auth/actions";

export default async function Home() {

  const user = await currentUser()

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>Hello World</h1>
    </div>
  );
}
