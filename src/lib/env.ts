function hasEnvValue(key: keyof NodeJS.ProcessEnv): boolean {
  const value = process.env[key];

  return typeof value === "string" && value.length > 0;
}

function readEnvValue(key: keyof NodeJS.ProcessEnv): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
}

export function getSupabaseEnvStatus() {
  return {
    url: hasEnvValue("NEXT_PUBLIC_SUPABASE_URL"),
    publishableKey: hasEnvValue("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    serviceRoleKey: hasEnvValue("SUPABASE_SERVICE_ROLE_KEY"),
  };
}

export function hasSupabaseBrowserEnv(): boolean {
  const { url, publishableKey } = getSupabaseEnvStatus();

  return url && publishableKey;
}

export function getSupabaseBrowserEnv() {
  return {
    url: readEnvValue("NEXT_PUBLIC_SUPABASE_URL"),
    publishableKey: readEnvValue("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
  };
}

export function getSupabaseServiceEnv() {
  return {
    ...getSupabaseBrowserEnv(),
    serviceRoleKey: readEnvValue("SUPABASE_SERVICE_ROLE_KEY"),
  };
}

