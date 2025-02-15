import "dotenv/config";
import { AI_PROMPT, Client, HUMAN_PROMPT } from "../src";

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  throw new Error("The ANTHROPIC_API_KEY environment variable must be set");
}

const client = new Client(apiKey);
const abortController = new AbortController();

client
  .complete(
    {
      prompt: `${HUMAN_PROMPT} How many toes do dogs have?${AI_PROMPT}`,
      stop_sequences: [HUMAN_PROMPT],
      max_tokens_to_sample: 200,
      model: "claude-v1",
    },
    { signal: abortController.signal }
  )
  .catch((error) => {
    if (error.name === "AbortError") {
      console.log("Cancelled complete()");
    }
  });

client
  .completeStream(
    {
      prompt: `${HUMAN_PROMPT} How many toes do dogs have?${AI_PROMPT}`,
      stop_sequences: [HUMAN_PROMPT],
      max_tokens_to_sample: 200,
      model: "claude-v1",
    },
    {
      onOpen: (response) => {
        console.log("Opened stream, HTTP status code", response.status);
      },
      onUpdate: (completion) => {
        console.log(completion.completion);
      },
      signal: abortController.signal,
    }
  )
  .catch((error) => {
    if (error.name === "AbortError") {
      console.log("Cancelled completeStream()");
    }
  });

abortController.abort();
