import * as PlayHT from "playht";
import type { APIRoute } from "astro";

const userid = process.env.PLAYHT_USER_ID || "";
const secretkey = process.env.PLAYHT_SECRET_KEY || "";

PlayHT.init({
  userId: userid,
  apiKey: secretkey,
  defaultVoiceId:
    "s3://voice-cloning-zero-shot/9fc626dc-f6df-4f47-a112-39461e8066aa/oliviaadvertisingsaad/manifest.json",
});

export const GET: APIRoute = async ({ request }): Promise<Response> => {
  try {
    const url = new URL(request.url);
    const text = url.searchParams.get("text") || "Hello world";
    const voiceId =
      url.searchParams.get("voiceId") ||
      "s3://voice-cloning-zero-shot/9fc626dc-f6df-4f47-a112-39461e8066aa/oliviaadvertisingsaad/manifest.json";

    const stream = await PlayHT.stream(text, {
      voiceEngine: "Play3.0-mini",
      voiceId: voiceId,
    });

    const chunks: Uint8Array[] = [];

    for await (const chunk of stream) {
      if (typeof chunk === "string") {
        const buffer = Buffer.from(chunk, "utf-8");
        chunks.push(new Uint8Array(buffer));
      } else if (Buffer.isBuffer(chunk)) {
        chunks.push(new Uint8Array(chunk));
      } else {
        console.warn("Received unknown chunk type:", typeof chunk);
      }
    }

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
