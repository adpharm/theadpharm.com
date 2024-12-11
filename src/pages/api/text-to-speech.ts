import * as PlayHT from "playht";
import type { APIRoute } from "astro";

const userid = process.env.PLAYHT_USER_ID || "";
const secretkey = process.env.PLAYHT_SECRET_KEY || "";

PlayHT.init({
  userId: userid,
  apiKey: secretkey,
  defaultVoiceId:
    "s3://voice-cloning-zero-shot/156a7b12-8e75-4f12-870d-d5436df5ec3a/original/manifest.json",
});

export const GET: APIRoute = async ({ request }): Promise<Response> => {
  try {
    const url = new URL(request.url);
    const text = url.searchParams.get("text") || "Hello world";

    // Stream the audio from PlayHT
    const stream = await PlayHT.stream(text, { voiceEngine: "Play3.0-mini" });

    const chunks: Uint8Array[] = [];

    for await (const chunk of stream) {
      if (typeof chunk === "string") {
        // If chunk is a string, convert it to a Buffer using UTF-8 encoding
        const buffer = Buffer.from(chunk, "utf-8");
        chunks.push(new Uint8Array(buffer));
      } else if (Buffer.isBuffer(chunk)) {
        // If chunk is a Buffer, convert it directly to Uint8Array
        chunks.push(new Uint8Array(chunk));
      } else {
        // Handle unexpected chunk types
        console.warn("Received unknown chunk type:", typeof chunk);
      }
    }

    // Combine all chunks into a single Blob
    const audioBlob = new Blob(chunks, { type: "audio/mpeg" });

    return new Response(audioBlob, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("Error generating TTS:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to generate TTS." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
