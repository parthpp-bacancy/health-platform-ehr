function hasEnvValue(key: string): boolean {
  const value = process.env[key];

  return typeof value === "string" && value.length > 0;
}

function readEnvValue(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
}

function resolveAnonKey(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

export function hasSupabaseBrowserEnv(): boolean {
  return hasEnvValue("NEXT_PUBLIC_SUPABASE_URL") && !!resolveAnonKey();
}

export function getSupabaseBrowserEnv() {
  const url = readEnvValue("NEXT_PUBLIC_SUPABASE_URL");
  const publishableKey = resolveAnonKey();

  if (!publishableKey) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return { url, publishableKey };
}

export function getSupabaseServiceEnv() {
  return {
    ...getSupabaseBrowserEnv(),
    serviceRoleKey: readEnvValue("SUPABASE_SERVICE_ROLE_KEY"),
  };
}
