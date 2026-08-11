import { readState, writeState } from "@/lib/store";
import { analyzeContent, type ContentDraft } from "@/lib/seo/analyze";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!secret && process.env.NODE_ENV === "production") return Response.json({ error: "CRON_SECRET is required in production." }, { status: 503 });

  const state = await readState();
  state.content = state.content.map((content) => {
    const customFieldText = Object.values(content.customFields ?? {}).join("\n");
    const draft: ContentDraft = {
      title: content.title, seoTitle: content.seoTitle, slug: content.path, description: content.description,
      content: `${content.content}\n${customFieldText}`, focusKeyword: content.focusKeyword, canonical: content.canonical,
      schemaType: content.schemaType, noindex: content.noindex, nofollow: content.nofollow, socialTitle: "", socialDescription: "", customFields: content.customFields,
    };
    return { ...content, score: analyzeContent(draft).score };
  });
  await writeState(state);
  return Response.json({ success: true, operation: "recalculate-seo-scores", records: state.content.length, completedAt: new Date().toISOString() });
}
