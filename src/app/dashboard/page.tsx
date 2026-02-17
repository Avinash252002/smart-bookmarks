import { createClient } from "@/lib/supabase/server";
import { BookmarkList } from "@/components/BookmarkList";
import { AddBookmark } from "@/components/AddBookmark";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-8">
      <AddBookmark userId={user!.id} />
      <BookmarkList initialBookmarks={bookmarks ?? []} userId={user!.id} />
    </div>
  );
}
