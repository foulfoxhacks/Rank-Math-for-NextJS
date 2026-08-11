import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { createDefaultState, type RuntimeState } from "@/lib/rank-math";

const dataFile = process.env.RANK_MATH_DATA_FILE
  ? path.resolve(process.env.RANK_MATH_DATA_FILE)
  : path.join(process.cwd(), "data", "runtime.json");

function hydrate(value: Partial<RuntimeState>): RuntimeState {
  const defaults = createDefaultState();
  const state: RuntimeState = {
    ...defaults,
    ...value,
    modules: { ...defaults.modules, ...(value.modules ?? {}) },
    settings: { ...defaults.settings, ...(value.settings ?? {}) },
    roles: { ...defaults.roles, ...(value.roles ?? {}) },
    adapters: { ...defaults.adapters, ...(value.adapters ?? {}) },
    adapterData: {
      profiles: value.adapterData?.profiles ?? defaults.adapterData.profiles,
      groups: value.adapterData?.groups ?? defaults.adapterData.groups,
      forumTopics: value.adapterData?.forumTopics ?? defaults.adapterData.forumTopics,
      products: value.adapterData?.products ?? defaults.adapterData.products,
      stories: value.adapterData?.stories ?? defaults.adapterData.stories,
    },
  };
  const endpoints: Record<string, string | undefined> = {
    community: process.env.COMMUNITY_ADAPTER_URL,
    forum: process.env.FORUM_ADAPTER_URL,
    commerce: process.env.COMMERCE_ADAPTER_URL,
    stories: process.env.STORY_ADAPTER_URL,
  };
  for (const [id, endpoint] of Object.entries(endpoints)) {
    if (endpoint) state.adapters[id] = { ...state.adapters[id], enabled: true, mode: "external", endpoint };
  }
  return state;
}

export async function readState(): Promise<RuntimeState> {
  try {
    const source = await readFile(dataFile, "utf8");
    return hydrate(JSON.parse(source) as Partial<RuntimeState>);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("Rank Math data store could not be read; defaults were loaded.", error);
    }
    return hydrate({});
  }
}

export async function writeState(state: RuntimeState): Promise<RuntimeState> {
  const nextState = { ...state, updatedAt: new Date().toISOString() };
  const directory = path.dirname(dataFile);
  const temporaryFile = `${dataFile}.${process.pid}.tmp`;
  await mkdir(directory, { recursive: true });
  await writeFile(temporaryFile, `${JSON.stringify(nextState, null, 2)}\n`, "utf8");
  await rename(temporaryFile, dataFile);
  return nextState;
}

export async function resetState(): Promise<RuntimeState> {
  return writeState(createDefaultState());
}
