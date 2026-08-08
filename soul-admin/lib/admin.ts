import { createAdminClient, createServerClientWithCookies } from "./supabase-server";

export async function requireAdmin() {
  const supabase = await createServerClientWithCookies();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }

  // Preferred: admin role stored in app_admins.
  const admin = createAdminClient();
  const { data } = await admin
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  const envEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map(x => x.trim().toLowerCase())
    .filter(Boolean);

  const emailAllowed = !!user.email && envEmails.includes(user.email.toLowerCase());

  if (!data && !emailAllowed) {
    throw new Error("FORBIDDEN");
  }

  return { user, admin };
}