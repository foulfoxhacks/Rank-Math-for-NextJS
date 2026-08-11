import { NextResponse } from "next/server";
import { readState, resetState, writeState } from "@/lib/store";
import type { ContentRecord, RedirectRecord, RuntimeState } from "@/lib/rank-math";
import { authorizeAdminMutation } from "@/lib/security";

export const dynamic = "force-dynamic";

type StateCommand =
  | { action: "toggle-module"; id: string; active: boolean }
  | { action: "set-mode"; mode: RuntimeState["mode"] }
  | { action: "set-connected"; connected: boolean }
  | { action: "save-settings"; values: RuntimeState["settings"] }
  | { action: "save-roles"; roles: RuntimeState["roles"] }
  | { action: "save-adapter"; id: string; adapter: RuntimeState["adapters"][string] }
  | { action: "complete-setup"; complete?: boolean }
  | { action: "save-content"; content: ContentRecord }
  | { action: "add-redirect"; redirect: Omit<RedirectRecord, "id" | "hits" | "lastAccessed"> }
  | { action: "delete-redirect"; id: string }
  | { action: "toggle-redirect"; id: string }
  | { action: "clear-404" }
  | { action: "delete-404"; id: string }
  | { action: "import"; state: Partial<RuntimeState> }
  | { action: "reset" };

export async function GET() {
  return NextResponse.json(await readState(), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PATCH(request: Request) {
  try {
    const unauthorized = authorizeAdminMutation(request);
    if (unauthorized) return unauthorized;
    const command = (await request.json()) as StateCommand;
    if (command.action === "reset") return NextResponse.json(await resetState());

    let state = await readState();
    switch (command.action) {
      case "toggle-module":
        state.modules[command.id] = command.active;
        break;
      case "set-mode":
        state.mode = command.mode;
        break;
      case "set-connected":
        state.connected = command.connected;
        break;
      case "save-settings":
        state.settings = { ...state.settings, ...command.values };
        break;
      case "save-roles":
        state.roles = command.roles;
        break;
      case "save-adapter":
        state.adapters[command.id] = command.adapter;
        break;
      case "complete-setup":
        state.setupComplete = command.complete ?? true;
        break;
      case "save-content": {
        const index = state.content.findIndex((item) => item.id === command.content.id);
        if (index >= 0) state.content[index] = command.content;
        else state.content.unshift(command.content);
        break;
      }
      case "add-redirect":
        state.redirects.unshift({
          ...command.redirect,
          id: crypto.randomUUID(),
          hits: 0,
          lastAccessed: new Date().toISOString(),
        });
        break;
      case "delete-redirect":
        state.redirects = state.redirects.filter((item) => item.id !== command.id);
        break;
      case "toggle-redirect":
        state.redirects = state.redirects.map((item) => item.id === command.id
          ? { ...item, status: item.status === "active" ? "inactive" : "active" }
          : item);
        break;
      case "clear-404":
        state.monitor404 = [];
        break;
      case "delete-404":
        state.monitor404 = state.monitor404.filter((item) => item.id !== command.id);
        break;
      case "import":
        state = {
          ...state,
          ...command.state,
          modules: { ...state.modules, ...(command.state.modules ?? {}) },
          settings: { ...state.settings, ...(command.state.settings ?? {}) },
          roles: { ...state.roles, ...(command.state.roles ?? {}) },
          adapters: { ...state.adapters, ...(command.state.adapters ?? {}) },
          adapterData: { ...state.adapterData, ...(command.state.adapterData ?? {}) },
        };
        break;
    }

    return NextResponse.json(await writeState(state));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update Rank Math state." },
      { status: 400 },
    );
  }
}
