import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();
  if (!user) return <div>Not logged in</div>;
  return (
    <div className="bg-background text-foreground">
      {" "}
      <nav className="flex flex-wrap items-center justify-between p-6 bg-slate-500">
        <div className="flex items-center flex-shrink-0 mr-6 text-white">
          <span className="text-xl font-semibold tracking-tight">
            Welcome to Essay Evaluator!
          </span>
        </div>

        <UserButton afterSignOutUrl="/" />
      </nav>
    </div>
  );
}
