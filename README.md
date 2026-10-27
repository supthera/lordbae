# Lord Bae

A private portfolio of residences. Dark, editorial, and deliberately small.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

This repository is the app. Import it on Vercel as its own project and set `NEXT_PUBLIC_SITE_URL` to the public origin so Open Graph URLs resolve.

Inquiry notes are validated and acknowledged. Wire the route in `app/api/inquiry/route.ts` to your private mail provider before relying on it for correspondence.

## Logo

The header reads `public/brand/Lord Bae.svg` and does not redraw it. The file in this repository is a typographic stand-in in the brand red `#c80e0e`: the original “Lord Bae.svg” was not attached to the workspace. Drop the exact file in at the same path and the lockup updates without a code change.

The tab icon is the crossed-swords emoji: `public/favicon.svg`, `public/favicon.ico`, and `public/apple-touch-icon.png`.
