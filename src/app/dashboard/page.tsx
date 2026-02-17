import { createClient } from "@/lib/supabase/server";
import { Dashboard } from "@/components/Dashboard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false });

  return <Dashboard initialBookmarks={bookmarks ?? []} userId={user!.id} />;
}
