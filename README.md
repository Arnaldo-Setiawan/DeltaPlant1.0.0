# DeltaPlant

DeltaPlant is a Vercel-ready strategy planning workspace for Delta Force.

## Stack

- Next.js App Router with TypeScript
- Tailwind CSS
- React Konva and Konva for the upcoming canvas layer
- Zustand for planner state
- Liveblocks for the planned serverless collaboration layer

## Setup

```powershell
npm.cmd install
npm.cmd run prepare:assets
npm.cmd run dev
```

The asset preparation script reads the Delta Force zip from:

```txt
j:\My Drive\Delta Force\df.qq.com-cp-a20240729directory-1779015848557.zip
```

Override it with:

```powershell
$env:DELTA_FORCE_ASSET_ZIP="C:\path\to\assets.zip"
npm.cmd run prepare:assets
```

Map images are normalized as a single slippy tile set using the source `{z}_{x}_{y}`
pattern. The default tile template is:

```txt
/assets/delta-force/maps/directory/{z}_{x}_{y}.webp
```

The source `deploy_*` assets are currently classified as vehicles. Constructs are
intentionally empty until dedicated construct assets are added.

## Environment

Copy `.env.example` to `.env.local` and fill in values as collaboration features are added.

```env
LIVEBLOCKS_SECRET_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Scripts

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run prepare:assets
```
