# 🌙 Moon Consort

A Discord relationship bot built with discord.js and PostgreSQL.

## Setup (local dev)

1. Clone this repo
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill in your values
4. Run `src/database/schema.sql` against your Neon Postgres database
5. `npm start`

## Deploy to Fly.io

1. Sign up at [neon.tech](https://neon.tech), create a project, copy the connection string
2. Run `src/database/schema.sql` against it (Neon SQL editor or `psql`)
3. Install the [Fly CLI](https://fly.io/docs/flyctl/install/), then `fly auth login`
4. From this folder: `fly launch --no-deploy` (it will detect the existing `fly.toml` — say no to creating a new Postgres app, you're using Neon)
5. Set secrets:
   ```bash
   fly secrets set DISCORD_TOKEN=xxx DATABASE_URL=xxx CLIENT_ID=xxx
   ```
6. `fly deploy`

## Environment Variables

- `DISCORD_TOKEN` — Your Discord bot token
- `DATABASE_URL` — Your Neon PostgreSQL connection string
- `CLIENT_ID` — Your Discord bot client ID
