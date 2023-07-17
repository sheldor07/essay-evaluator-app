"use client";
import { ReactEventHandler, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
interface IApiResponse {
  labels: string[];
  scores: number[];
}

export default function Home() {
  const { user } = useUser();
  const [text, setText] = useState("");
  const [predictions, setPredictions] = useState<Record<string, number>>({});
  const candidateLabels = ["technology", "humanities", "sciences", "business"];
  const [loading, setLoading] = useState(false);
  if (!user) return <div>Not logged in</div>;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const data = {
      inputs: text,
      parameters: { candidate_labels: candidateLabels },
    };

    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
      {
        headers: {
          Authorization: "Bearer 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",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    const result = (await response.json()) as IApiResponse;
    let newPredictions: Record<string, number> = {};
    for (let i = 0; i < result.labels.length; i++) {
      newPredictions[result.labels[i]] = result.scores[i];
    }
    setPredictions(newPredictions);
    setLoading(false);
  };

  return (
    <div className=" text-primary-foreground">
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
          <form onSubmit={handleSubmit}>
            <Textarea
              className="h-72"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button className="my-6 bg-primary " variant="outline">
              Submit
            </Button>
          </form>
        </div>
        {loading ? (
          <>
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </>
        ) : (
          <div className="flex flex-col p-4 mt-6 rounded-xl border-slate-800">
            <div className="flex border border-slate-600">
              <div className="w-1/2 px-4 py-2 border-r border-slate-600">
                Label
              </div>
              <div className="w-1/2 px-4 py-2">Score</div>
            </div>
            {Object.entries(predictions).map(([label, score]) => (
              <div key={label} className="flex border-b border-slate-600">
                <div className="w-1/2 px-4 py-2 border-r border-slate-600">
                  {label}
                </div>
                <div className="w-1/2 px-4 py-2">{score}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
