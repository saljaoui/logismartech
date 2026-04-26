# LogiSmartech Backend MVP

Monolithic AI-powered backend for your hackathon stack:
- Node.js + Express
- Prisma ORM + SQLite
- OpenAI SDK for NLP extraction
- Greedy Smart Groupage optimizer

## 1) Setup

```bash
cd backend
cp .env.example .env
npm install
npm run db:init
npm run dev
```

Server: `http://localhost:4000`

## 2) Core Endpoints

### POST `/api/webhook/whatsapp`

Creates a `Cooperative` from a WhatsApp-like message using AI extraction.

Request:
```json
{
  "text": "I have 80 boxes of Argan oil ready for Europe",
  "phone": "+212600123456",
  "name": "Farmer Amina"
}
```

### GET `/api/containers/predict`

Returns containers currently at Nador West Med (`status = AT_NADOR_WEST_MED`) with simulated confidence scores.

### POST `/api/match/optimize`

Runs greedy groupage optimization.

Request:
```json
{
  "containerId": 1
}
```

## 3) Docker (rootless)

```bash
cd backend
docker build -t logismartech-backend .
docker run --rm -p 4000:4000 --name logismartech-backend logismartech-backend
```

## 4) Next.js Integration

Set frontend env:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

Then call the endpoints from your Next.js app.
