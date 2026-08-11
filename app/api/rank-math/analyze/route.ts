import { NextResponse } from "next/server";
import { analyzeContent, type ContentDraft } from "@/lib/seo/analyze";

export async function POST(request: Request) {
  try {
    const draft = (await request.json()) as ContentDraft;
    return NextResponse.json(analyzeContent(draft));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "The content could not be analyzed." },
      { status: 400 },
    );
  }
}
