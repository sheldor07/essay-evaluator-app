import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();
  if (!user) return <div>Not logged in</div>;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = setTimeout(() => {
      return "this is the response";
    }, 2000);
    console.log(response);
    // const data = await response.json();
    // console.log(data);
  }

  return (
    <div className="bg-primary text-primary-foreground">
      {" "}
      <nav className="flex flex-wrap items-center justify-between p-6 bg-zinc-500">
        <div className="flex items-center flex-shrink-0 mr-6 text-white">
          <span className="text-xl font-semibold tracking-tight">
            Welcome to Essay Evaluator!
          </span>
        </div>

        <UserButton afterSignOutUrl="/" />
      </nav>
      <div className="grid grid-cols-2 m-12">
        <div className="flex flex-col">

          <form
         >
            <Textarea className="h-72" />
            <Button className="my-6 bg-primary " variant="outline">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
