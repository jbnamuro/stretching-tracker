Stretching Tracker

A full-stack web app for building and tracking a personalized stretching routine, powered by AI-generated recommendations for your needs.

Overview
After workouts I kept skipping stretching, and over time it started showing up as aches and pains. I built Stretching Tracker to hold myself accountable: describe what you want to target (e.g. "upper back," "hip flexors") and it generates a short routine for that area, then logs your sessions so you can actually see whether you're keeping up with it or not.

## Tech Stack
- **Frontend:** React
- **Backend:** Express.js
- **Database:** PostgreSQL (hosted on Neon), Prisma ORM
- **Auth:** JWT, bcrypt
- **AI:** Anthropic API, generates personalized stretching routines based on natural-language input (e.g. a target muscle group or problem area)

Features
- User authentication (signup/login)
- Request a custom stretching routine by describing what you want to target
- AI-generated routine tailored to that request
- Log completed sessions to build a simple, ongoing record of your stretching habits
- Track consistency over time so gaps are easy to spot

## What I Learned / Challenges
Before this project my backend experience was limited to non-technical, unsecured school assignments. Building Stretching Tracker was my first real hands-on work with a production-style backend, proper auth (JWT/bcrypt), a real database with an ORM, and integrating an external API into an actual product. It gave me a much better handle on how these pieces fit together outside of a classroom setting.
