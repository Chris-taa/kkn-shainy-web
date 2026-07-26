import { supabase } from "@/lib/supabaseClient";

export type UserRole = "admin" | "committee";

/**
 * Ambil role akun (admin/committee) dari tabel `profiles`.
 * Return null kalau user gak punya profile (belum di-assign role apapun).
 */
export async function getUserRole(userId: string): Promise<UserRole | null> {
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  return (data?.role as UserRole | undefined) ?? null;
}
