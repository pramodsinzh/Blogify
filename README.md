# Blogify

A full-stack blogging platform: public reading, signed-in authors, an admin area, comments, newsletter signup, and contact. The app uses **React** with **Vite** on the front end and **Express** with **MongoDB** on the back end, with **Clerk** for authentication.

## Features

- **Public site**: Home, blog listing and detail pages, About, FAQs, and a contact form.
- **Authors (Clerk)**: Sign in to create posts, manage “my blogs,” and comment on posts.
- **Admin dashboard**: JWT-protected routes under `/admin` for managing posts, comments, and newsletter subscribers (separate from Clerk user flows).
- **Rich editing**: Quill editor, Markdown rendering, image uploads (ImageKit when configured).
- **AI-assisted writing**: Optional Google Gemini integration for content generation from the admin/blog flows.
- **Email & automation**: Nodemailer for transactional mail; **Inngest** for workflows (for example Clerk user sync and blog notifications) when configured.

## Tech stack

| Layer | Technologies |
|--------|----------------|
| **Frontend** | React 19, Vite 7, React Router 7, Tailwind CSS 4, Axios, Clerk (`@clerk/react`), Quill, Motion |
| **Backend** | Express 5, Mongoose (MongoDB), Clerk (`@clerk/express`), Multer, JWT, Inngest, Nodemailer |
| **Integrations** | Clerk (auth), ImageKit (images), Google Gemini (optional AI), SMTP (optional mail) |
| **Monorepo scripts** | Root `package.json` uses `concurrently` to run the frontend dev server and backend together |

## Prerequisites

- **Node.js** (LTS recommended) and **npm**
- **MongoDB** reachable at the URI you set in `.env` (local or Atlas)

## Installation

```bash
git clone https://github.com/pramodsinzh/Blogify.git
cd Blogify
npm install
cd frontend && npm install
cd ../backend && npm install
```

The root `npm install` only installs shared tooling (for example `concurrently`). Install dependencies in `frontend` and `backend` as above.

## Environment variables

### Backend (`backend/.env`)

Copy the example file and adjust values:

```bash
cp backend/.env.example backend/.env
```

`backend/.env.example` documents core settings: `PORT`, `MONGODB_URI`, admin credentials, `JWT_SECRET`, and `CONTACT_EMAIL`. For a full local setup you will also need:

- **Clerk**: Secret and publishable keys as required by [@clerk/express](https://clerk.com/docs/references/backend/overview) (typically `CLERK_SECRET_KEY` and related Clerk env vars from your Clerk dashboard).
- **Optional**: `GEMINI_API_KEY`, ImageKit (`IMAGEKIT_PRIVATE_KEY`), SMTP variables for mail, and Inngest configuration if you use those features.

The API default port is **3001** if `PORT` is unset.

### Frontend (`frontend/.env`)

Create `frontend/.env` with:

- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk publishable key for the React app.
- `VITE_BASE_URL` — Base URL of the backend API (for example `http://localhost:3001` during local development).

Vite’s dev server defaults to **http://localhost:5173** unless you change it in `vite.config.js`.

## Running the app

From the **project root**:

| Command | Description |
|---------|-------------|
| `npm run dev:frontend` | Vite dev server (frontend only) |
| `npm run server:backend` | Express API with nodemon (backend only) |
| `npm run project` | Frontend + backend together |

Production-style commands: `npm run start:frontend` and `npm run start:backend`.

## Project structure

```text
Blogify/
  frontend/     # Vite + React app (pages, components, admin UI)
  backend/      # Express API, models, routes, Inngest functions
  package.json  # Root scripts and concurrently
  README.md
```

## Contributing

1. Fork the repository.
2. Create a branch for your feature or fix.
3. Commit and push your changes.
4. Open a pull request with a clear description of what changed and why.

## License

This project is licensed under the **ISC** license (see `package.json`).
