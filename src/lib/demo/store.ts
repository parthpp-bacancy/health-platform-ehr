import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { buildDemoDatabase } from "@/lib/demo/seed";
import { type DemoDatabase } from "@/lib/demo/types";

const dataDirectory = path.join(process.cwd(), "data", "runtime");
const dataFile = path.join(dataDirectory, "demo-db.json");

async function ensureDemoDatabase() {
  await mkdir(dataDirectory, { recursive: true });

  try {
    await readFile(dataFile, "utf8");
  } catch {
    await writeFile(dataFile, JSON.stringify(buildDemoDatabase(), null, 2), "utf8");
  }
}

export async function readDemoDatabase(): Promise<DemoDatabase> {
  await ensureDemoDatabase();
  const contents = await readFile(dataFile, "utf8");
  return JSON.parse(contents) as DemoDatabase;
}

export async function writeDemoDatabase(database: DemoDatabase) {
  await ensureDemoDatabase();
  await writeFile(dataFile, JSON.stringify(database, null, 2), "utf8");
}

export async function mutateDemoDatabase<T>(
  mutator: (database: DemoDatabase) => T | Promise<T>
) {
  const database = await readDemoDatabase();
  const result = await mutator(database);
  await writeDemoDatabase(database);
  return result;
}

