# Talkify - MERN Chat (Deployment-ready)

## What you got
- `server/` - Express + Socket.io + MongoDB + JWT auth
- `client/` - React + Vite + Tailwind + Socket.io-client

## Quick start (local)
1. Backend:
   ```bash
   cd server
   npm install
   cp .env.example .env
   # update .env with MONGO_URI and JWT_SECRET
   npm run dev
   ```
2. Frontend:
   ```bash
   cd client
   npm install
   cp .env.example .env
   npm run dev
   ```

## Generate JWT secret
Run:
```
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Deploy
- Use MongoDB Atlas for the `MONGO_URI`.
- Deploy `server/` to Render, set start command `npm start` and environment variables.
- Deploy `client/` to Vercel (or Netlify) and set `VITE_API_URL` + `VITE_SOCKET_URL` env vars.
- Alternatively build client and serve static files from server (server configured to serve `/client/dist` when NODE_ENV=production).
