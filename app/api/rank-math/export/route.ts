import { NextResponse } from "next/server";
import { readState } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return new NextResponse(JSON.stringify(await readState(), null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": "attachment; filename=rank-math-next-settings.json",
      "Cache-Control": "no-store",
    },
  });
}
