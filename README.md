# Greenland Arctic Coral Health Estimator (GACHE)

Bare-bones Next.js 14 MVP dashboard for estimating Arctic cold-water coral health from surface ocean parameters.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React
- Recharts

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- Interactive sliders for surface temperature, pH, and microplastic density
- Health index, Ω_arag, extension rate, and stress level metrics
- Scatter plot with OLS regression vs selected parameter
- Baseline vs current comparison bar chart
- CSV upload (`lat`, `lon`, `temp`, `ph`, `microplastics`) — see `public/sample-stations.csv`

## Model

Client-side multivariate linear proxy in `lib/coralModel.ts`:

- Health = clamp(100 − temp/acidification/microplastic penalties, 0, 100)
- Ω_arag = 1.0 + (pH − 7.8) × 2.5
- Extension rate = max(0, 2.2 × (Ω_arag − 0.8)) mm/yr
