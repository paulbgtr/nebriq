# 🧠 Nebriq

> _Write. Ask. Know._  
> A future-facing AI writing space that transforms your thoughts into a dynamic, connected knowledge system — no folders, no friction, no context lost.

---

## ✨ What is Nebriq?

**Nebriq** is an AI-powered, folderless note-taking tool designed for how your brain actually works — not how filing cabinets do.

- 📓 Just write. No need to organize stuff manually.
- 🔍 Ask questions in plain language. Get answers with references.
- 🌐 Discover hidden connections between ideas as you write.
- 🧭 Navigate your thinking like a living knowledge map.
- 📶 Built for privacy, built for devs — 100% open source.

---

## 🔥 Core Features

- 💬 **AI Chat with Your Notes**  
  Ask things like: _"What were the key points from last week’s research?"_

- 🕸 **Dynamic Knowledge Graph**  
  See how your thoughts connect. Explore patterns in real time.

- ⚡️ **Smart Search & Context Retrieval**  
  Natural language + AI = “I don’t remember the exact words” is no problem.

- 🧠 **Semantic Linking on the Fly**  
  Notes auto-connect as you write. Your knowledge evolves without extra effort.

- 🎨 **Markdown, LaTeX & Code Support**  
  Beautiful formatting for deep thinking, math, and dev workflows.

---

## 🚀 Getting Started

> **Nebriq is open source. Self-hostable. Yours.**  
> You can run it locally, or deploy it wherever you like.

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/nebriq.git
cd nebriq
```

### 2. Install dependencies

```bash
bun install
```

### 3. Set up your .env

```bash
cp .env.example .env
```

Fill in your Supabase credentials (SUPABASE_URL, SUPABASE_ANON_KEY, etc.)

### 4. Set up the Supabase Project and run migrations

- Go to [supabase.com](https://supabase.com) and create a new project.
- Push migrations to your project. - Reference [supabase/cli/push](https://supabase.com/docs/reference/cli/supabase-db-push) for more details.

### 5. Start the dev server

```bash
bun dev
```

Open http://localhost:3000 to start writing ✍️

---

## 📦 Tech Stack

• Next.js (App Router)
• Supabase (auth, storage, realtime DB)
• TypeScript
• TailwindCSS
• AI/LLM integration (local + remote)
• Graph-based knowledge linking

---

## 🛡 License

AGPLv3 — Nebriq is free and open source.
If you run it as a public service, you’re required to share your changes too.

Want a commercial license or support? Get in touch

---

## 🌱 Roadmap

• Offline-first mode (local-first db)
• Custom LLM adapters (Ollama, LM Studio, Claude)
• Mobile-ready UI
• Public note publishing
• Plugin system (extensions, embeddables)

---

## ❤️ Contributing

Nebriq is open to contributions — ideas, issues, PRs, memes, all welcome.
Let’s build the next-gen brain together.

---

## 🌀 Stay in the loop

- 🌐 Website: [nebriq.com](https://nebriq.com)
