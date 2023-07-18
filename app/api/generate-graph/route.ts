import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    PromptTemplate,
    SystemMessagePromptTemplate,
  } from "langchain/prompts";

import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { message } = await request.json()
    if(!message) return NextResponse.redirect('/')
    const chat = new ChatOpenAI({ temperature: 0 });
    const template = `You are a knowledge graph extractor, and your
    task is to extract and return a
    knowledge graph from a given text.Lets
    extract it step by step:
    (1). Identify the entities in the text. An
    entity can be a noun or a noun phrase
    that refers to a real-world object or an
    abstract concept. You can use a named
    entity recognition (NER) tool or a partof-speech (POS) tagger to identify the
    entities.
    (2). Identify the relationships between the
    entities. A relationship can be a verb or
    a prepositional phrase that connects two
    entities. You can use dependency parsing
    to identify the relationships.
    (3). Summarize each entity and relation as
    short as possible and remove any stop
    words.
    (4). Only return the knowledge graph in the
    triplet format: ("head entity", "relation
    ", "tail entity").
    (5). Most importantly, if you cannot find any
    knowledge, please just output: "None".
    Here is the content: {essay}?`
    const response = await chat.call([
        new HumanMessage(message),
      ]);
}
