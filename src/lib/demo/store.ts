import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { buildDemoDatabase } from "@/lib/demo/seed";
import { type DemoDatabase } from "@/lib/demo/types";

const isVercel = process.env.VERCEL === "1";
const baseDir = isVercel ? "/tmp" : path.join(process.cwd(), "data", "runtime");
const dataFile = path.join(baseDir, "demo-db.json");

let memoryCache: DemoDatabase | null = null;

async function ensureDemoDatabase() {
  if (memoryCache) return;

  await mkdir(baseDir, { recursive: true });

  try {
    const contents = await readFile(dataFile, "utf8");
    memoryCache = JSON.parse(contents) as DemoDatabase;
  } catch {
    memoryCache = buildDemoDatabase();
    await writeFile(dataFile, JSON.stringify(memoryCache, null, 2), "utf8");
  }
}

export async function readDemoDatabase(): Promise<DemoDatabase> {
  await ensureDemoDatabase();
  return memoryCache!;
}

export async function writeDemoDatabase(database: DemoDatabase) {
  memoryCache = database;
  try {
    await mkdir(baseDir, { recursive: true });
    await writeFile(dataFile, JSON.stringify(database, null, 2), "utf8");
  } catch {
    // Filesystem write may fail in some serverless environments; in-memory cache still works for the request lifecycle
  }
}

export async function mutateDemoDatabase<T>(
  mutator: (database: DemoDatabase) => T | Promise<T>
) {
  const database = await readDemoDatabase();
  const result = await mutator(database);
  await writeDemoDatabase(database);
  return result;
}
