import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";

loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error("Missing Supabase URL or service role key.");
}

const supabase = createClient(url, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const demoUsers = [
  {
    email: "admin@luma.health",
    password: "LumaAdmin123!",
    first_name: "Amelia",
    last_name: "Reed",
    role: "admin",
    title: "Operations Director",
  },
  {
    email: "provider@luma.health",
    password: "LumaProvider123!",
    first_name: "Dylan",
    last_name: "Park",
    role: "provider",
    title: "MD",
    specialty: "Family Medicine",
  },
  {
    email: "care@luma.health",
    password: "LumaCoordinator123!",
    first_name: "Nina",
    last_name: "Flores",
    role: "care_coordinator",
    title: "RN",
  },
  {
    email: "patient@luma.health",
    password: "LumaPatient123!",
    first_name: "Jordan",
    last_name: "Lee",
    role: "patient",
  },
];

async function ensureUser(user: (typeof demoUsers)[number]) {
  const existing = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const found = existing.data.users.find((candidate) => candidate.email === user.email);

  if (found) {
    return found;
  }

  const created = await supabase.auth.admin.createUser({
    email: user.email,
    password: user.password,
    email_confirm: true,
    user_metadata: {
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      title: user.title,
      specialty: user.specialty,
    },
  });

  if (created.error) {
    throw created.error;
  }

  return created.data.user;
}

async function main() {
  for (const user of demoUsers) {
    await ensureUser(user);
  }

  const organizationCheck = await supabase.from("organizations").select("id, slug").limit(1);

  if (organizationCheck.error) {
    console.log("Demo auth users created. Public schema tables are not available yet, so relational seed data was skipped.");
    return;
  }

  console.log("Demo auth users created or already present.");
  console.log("Relational tables are reachable. Run the migration manually in Supabase, then extend this seed script if you want remote sample records to match the local demo dataset exactly.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

