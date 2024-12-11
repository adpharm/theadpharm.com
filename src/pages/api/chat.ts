import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import type { APIRoute } from "astro";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
  baseURL: "https://api.openai.com/v1",
  compatibility: "strict",
});

// Handle POST requests
export const POST: APIRoute = async ({ request }): Promise<Response> => {
  try {
    const { conversation } = await request.json();

    console.log("Sending to AI: ", conversation);

    // Construct the prompt based on the conversation
    const prompt = conversation
      .map((msg: any) => {
        if (msg.role === "system") {
          console.log("System instruction...");
          return `System: ${msg.content}`;
        } else if (msg.role === "user") {
          console.log("User instruction...");
          return `User: ${msg.content}`;
        } else if (msg.role === "assistant") {
          console.log("AI instruction...");
          return `Assistant: ${msg.content}`;
        }
      })
      .join("\n");

    console.log("Prompt being sent: ", prompt);

    // generate ai response with sdk
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: prompt,
      temperature: 0.2,
    });

    console.log("Response from AI: ", text);

    // Extract and clean the AI's response
    const aiMessage = text.trim();

    return new Response(
      JSON.stringify({
        success: true,
        message: aiMessage,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error communicating with Perplexity AI:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to communicate with AI.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
