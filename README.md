# Help Me Name My New Puppy 🐾

A tiny, playful naming-contest web app. Vote for your favorite name and
watch the leaderboard update in real time.

This app uses [Twilio Verify](https://www.twilio.com/docs/verify) to
send a one-time code to each voter's phone, so a phone number can only
vote once.

## How it works

1. A voter clicks "Vote" on a name and enters their phone number.
2. The server calls `verifyService.verifications.create()` to send a one-time code via SMS.
3. The voter enters the code, and the server calls `verifyService.verificationChecks.create()` to confirm it.
4. If the code is valid, the vote is recorded and that phone number is marked as having voted.

The core integration lives in `lib/verify.js` — two small functions that
wrap the Twilio Verify API.

## Setup

1. Create a [Twilio account](https://www.twilio.com/try-twilio) and a
   [Verify Service](https://www.twilio.com/docs/verify/quickstart) in the
   [Twilio Console](https://console.twilio.com/us1/develop/verify/services).
2. Copy `.env.example` to `.env` and fill in your credentials:

   ```bash
   cp .env.example .env
   ```

   ```
   TWILIO_ACCOUNT_SID=       # found on your Twilio Console dashboard
   TWILIO_AUTH_TOKEN=        # found on your Twilio Console dashboard
   TWILIO_VERIFY_SERVICE_SID=  # found on your Verify Service page, starts with "VA"
   ```

   On Replit, add these as [Secrets](https://docs.replit.com/replit-workspace/workspace-features/secrets) instead of a `.env` file.

## Run it on Replit

[![Run on Replit](https://replit.com/badge/github/twilio-samples/replit-verify)](https://replit.com/github.com/twilio-samples/replit-verify)

## Run it locally

```bash
npm install
npm start
```

Then open http://localhost:3000.

## Stack

- Express server with in-memory storage (`server.js`)
- Twilio Verify for phone number verification (`lib/verify.js`)
- Static HTML/CSS/JS frontend (`public/`)
- No database, no user accounts — just names, vote counts, and a set of verified phone numbers
