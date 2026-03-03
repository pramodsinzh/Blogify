Blogify
=======

A full‑stack blogging platform with a modern frontend and a Node.js backend. Blogify lets users create, edit, and manage blog posts with a smooth developer and reader experience.

## Features

- **Modern UI**: Clean, responsive frontend built in the `frontend` app.
- **API‑driven backend**: Dedicated `backend` service for posts, users, and other resources.
- **Full‑stack dev workflow**: Single command to run frontend and backend together.
- **Developer‑friendly setup**: Simple scripts and clear structure for local development.

## Tech Stack

- **Frontend**: JavaScript (see `frontend` folder for framework and tooling)
- **Backend**: Node.js (see `backend` folder for framework and database details)
- **Tooling**: `npm`, `concurrently` for running both apps in parallel

## Getting Started

### Prerequisites

- **Node.js** (LTS recommended)
- **npm** (comes with Node)

### Installation

```bash
git clone https://github.com/pramodsinzh/Blogify.git
cd Blogify
npm install
```

Then install dependencies for the frontend and backend (from the project root):

```bash
cd frontend && npm install
cd ../backend && npm install
```

## Running the App

From the project root:

- **Run frontend only**:

  ```bash
  npm run dev:frontend
  ```

- **Run backend only**:

  ```bash
  npm run server:backend
  ```

- **Run full project (frontend + backend together)**:

  ```bash
  npm run project
  ```

Check your terminal output for the exact ports (commonly something like `http://localhost:3000` for frontend and another port for backend).

## Project Structure

```text
Blogify/
  frontend/   # Frontend application
  backend/    # Backend API / server
  package.json
  README.md
```

See the `frontend` and `backend` directories for more detailed, framework‑specific documentation (components, routes, models, etc.).

## Scripts (root)

- **`npm run start:frontend`**: Start the frontend in production/start mode.
- **`npm run start:backend`**: Start the backend in production/start mode.
- **`npm run dev:frontend`**: Run the frontend in development mode.
- **`npm run server:backend`**: Run the backend dev server.
- **`npm run project`**: Run frontend and backend together using `concurrently`.

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit and push your changes.
4. Open a pull request with a clear description of your changes.

## License

This project is licensed under the **ISC** license. See the `LICENSE` file if present, or the license section in `package.json`.
