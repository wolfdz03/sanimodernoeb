This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Environment

Copy `env.example` to `.env.local` and set your Supabase credentials:

- `NEXT_PUBLIC_SUPABASE_URL` – from your [Supabase project](https://supabase.com/dashboard)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – anon/public key from Project Settings → API
- `ADMIN_EMAILS` (optional) – comma-separated emails allowed to access `/dashboard`
- `NEXT_PUBLIC_FB_PIXEL_ID` (optional) – Facebook/Meta Pixel ID for conversion tracking and ads

Run the SQL in `supabase/migrations/` in the Supabase SQL Editor (00001, 00002, 00003), then `supabase/seed.sql`. To create an admin: run `supabase/admin_setup.sql` and replace `admin@example.com` with your email; then sign in at `/connexion` to access `/dashboard`. Admin access is determined only by the `public.admins` table (not auth.users).

**Product images** are uploaded to a Supabase Storage bucket named `product-images`. The bucket is created automatically on first upload (using the service role key). You can also create it manually in the Dashboard: Storage → New bucket → name `product-images`, set to **Public**.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
