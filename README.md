# Smart Bookmarks

A real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS. Sign in with Google, save bookmarks, and see updates across tabs instantly.

## Features

- Google OAuth authentication via Supabase
- Add and delete bookmarks
- Real-time sync across browser tabs using Supabase Realtime
- Row Level Security — users only see their own bookmarks
- Responsive, minimal UI with dark mode support

## Setup

### 1. Create a Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and create a new project
2. Copy your **Project URL** and **anon public key** from Settings > API

### 2. Set Up Google OAuth

1. In Supabase Dashboard: Authentication > Providers > Google — enable it
2. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials): create an OAuth 2.0 Client ID
3. Set the authorized redirect URI to: `https://<your-project>.supabase.co/auth/v1/callback`
4. Copy the Client ID and Client Secret into the Supabase Google provider settings

### 3. Create the Database Schema

Run the SQL in `supabase-schema.sql` in the Supabase SQL Editor. Then enable Realtime on the `bookmarks` table:

- Go to Database > Replication > toggle on `bookmarks`

### 4. Configure Environment Variables

Copy `.env.local` and fill in your values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Deploy to Vercel

1. Push to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables
4. In Supabase Dashboard: Authentication > URL Configuration — add your Vercel URL to the redirect allow list

## Tech Stack

- [Next.js](https://nextjs.org) (App Router)
- [Supabase](https://supabase.com) (Auth, Database, Realtime)
- [Tailwind CSS](https://tailwindcss.com)
- TypeScript
