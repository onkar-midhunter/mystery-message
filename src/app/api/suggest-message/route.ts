import { streamText } from "ai";
import { openai } from "@/lib/openai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const prompt = `
Create a list of three open-ended and engaging questions, separated by '||'.
Avoid personal/sensitive identity topics.
Keep them friendly, curiosity-driven, and universal.

Example:
"What’s a hobby you've recently picked up?||If you could learn any skill instantly, what would it be?||What’s something small that made you smile recently?"
    `;

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      prompt,
      maxOutputTokens: 200,
    });

    return result.toTextStreamResponse();
  } catch (error: unknown) {
    console.error("Suggest-message API Error:", error);

    // API/SDK errors
    if (typeof error === "object" && error !== null && "status" in error) {
      const err = error as any;
      return Response.json(
        {
          success: false,
          error: "AI Provider Error",
          status: err.status,
          message: err.message,
        },
        { status: err.status ?? 500 }
      );
    }

    // Input/type issues
    if (error instanceof TypeError) {
      return Response.json(
        {
          success: false,
          error: "Invalid Request",
          message: error.message,
        },
        { status: 400 }
      );
    }

    // Fallback
    return Response.json(
      {
        success: false,
        error: "Internal Server Error",
        message: "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
