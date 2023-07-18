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
  const [model, setModel] = useState("");
  const [error, setError] = useState("");
  const candidateLabels = ["technology", "humanities", "sciences", "business"];
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setLoading(true);
    const data = {
      inputs: text,
      parameters: { candidate_labels: candidateLabels },
    };
    let modelURL = "";

    switch (model) {
      case "mnli":
        modelURL =
          "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";
        break;
      case "deberta":
        modelURL =
          "https://api-inference.huggingface.co/models/MoritzLaurer/DeBERTa-v3-large-mnli-fever-anli-ling-wanli";
        break;
      // Add more cases as needed
      default:
        modelURL =
          "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";
        break;
    }
    const response = await fetch(modelURL, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      console.log(response);
      setError("Something went wrong. Please try again later.");
      setLoading(false);
      return;
    }
    const result = (await response.json()) as IApiResponse;
    let newPredictions: Record<string, number> = {};
    for (let i = 0; i < result.labels.length; i++) {
      newPredictions[result.labels[i]] = result.scores[i];
    }
    console.log(newPredictions);
    setPredictions(newPredictions);
    setLoading(false);
  };
  async function generateKnowledgeGraph(){
    
  }

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
      <div className="grid grid-cols-1 m-12 md:grid-cols-2">
        <div className="flex flex-col">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={error?.length > 0 ? "border-red-500" : " "}
          />
          {error?.length > 0 && <p className="text-red-500">{error}</p>}
          <div className="flex flex-col w-full p-2">
            <p className="font-bold text-black text-md">Topic Classification</p>
            <Button
              onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                setModel("mnli");
                handleSubmit(e);
              }}
              className="w-full my-1 bg-teal-200"
              variant="outline">
              facebook/bart-large-mnli
            </Button>
            <Button
              onClick={(e) => {
                setModel("deberta");
                handleSubmit(e);
              }}
              className="w-full my-1 bg-teal-200"
              variant="outline">
              MoritzLaurer/DeBERTa-v3-large-mnli-fever-anli-ling-wanli
            </Button>
            {/* <Button
              onClick={(e) => {
                setModel("mnli");
                handleSubmit(e);
              }}
              className="w-full my-1 bg-teal-200"
              variant="outline">
              Submit
            </Button> */}
          </div>
        </div>
        {loading ? (
          <>
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </>
        ) : (
          <div className="flex flex-col p-4 mt-6 rounded-xl border-slate-800">
            <h1 className="text-xl text-black ">{model}</h1>
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
