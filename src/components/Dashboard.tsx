"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Bookmark {
  id: string;
  user_id: string;
  url: string;
  title: string;
  created_at: string;
}

export function Dashboard({
  initialBookmarks,
  userId,
}: {
  initialBookmarks: Bookmark[];
  userId: string;
}) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);

  const fetchBookmarks = useCallback(async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setBookmarks(data);
  }, [supabase]);

  useEffect(() => {
    fetchBookmarks();

    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
        },
        () => {
          // Refetch on any change — works reliably across tabs
          fetchBookmarks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchBookmarks]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !title.trim()) return;

    setLoading(true);
    setError(null);

    const { error: insertError } = await supabase
      .from("bookmarks")
      .insert({ url: url.trim(), title: title.trim(), user_id: userId });

    if (insertError) {
      setError(insertError.message);
    } else {
      setUrl("");
      setTitle("");
      // Immediately refetch so we don't depend on realtime for same-tab updates
      await fetchBookmarks();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await supabase.from("bookmarks").delete().eq("id", id);
    await fetchBookmarks();
    setDeleting(null);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Add Bookmark Form */}
      <form onSubmit={handleAdd} className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Add Bookmark
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="h-11 flex-1 rounded-xl border border-zinc-200 bg-white px-4 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500"
          />
          <input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="h-11 flex-1 rounded-xl border border-zinc-200 bg-white px-4 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="h-11 shrink-0 rounded-xl bg-blue-600 px-6 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </form>

      {/* Bookmark List */}
      {bookmarks.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-zinc-500 dark:text-zinc-400">
            No bookmarks yet. Add your first one above!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Your Bookmarks
          </h2>
          <div className="flex flex-col gap-2">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-5 py-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                <div className="flex flex-col gap-1 overflow-hidden">
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    {bookmark.title}
                  </span>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {bookmark.url}
                  </a>
                </div>
                <button
                  onClick={() => handleDelete(bookmark.id)}
                  disabled={deleting === bookmark.id}
                  className="ml-4 shrink-0 rounded-lg px-3 py-1.5 text-sm text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-red-950 dark:hover:text-red-400"
                >
                  {deleting === bookmark.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
