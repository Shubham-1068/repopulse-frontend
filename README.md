This is a [Next.js](https://nextjs.org) frontend for RepoPulse.

## Environment Variables

Create a `.env` file in the project root (or copy `.env.example`):

```bash
cp .env.example .env
```

Set these values:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

Notes:

- `NEXT_PUBLIC_*` variables are available in browser code.
- Do not hardcode credentials in source files.
- Restart the Next.js dev server after changing `.env`.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Run lint checks:

```bash
npm run lint
```
