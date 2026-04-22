# Setup — Joshua's machine

One-time setup, then a daily pull/push rhythm. ~15 min to get running.

---

## 1. Install prerequisites (one-time)

If you don't already have these:

- **Git for Windows** — https://git-scm.com/download/win
- **Node.js (LTS)** — https://nodejs.org/ (for the dashboard)
- **Claude Code** — already installed if you're reading this through it
- **VS Code** (recommended) — https://code.visualstudio.com/

---

## 2. Clone the workspace

Open a terminal (Git Bash, PowerShell, or VS Code terminal) and run:

```bash
cd ~/Desktop
git clone https://github.com/JIRAHGrowth/jirah_HQ.git "Jirah Ops"
cd "Jirah Ops"
```

You now have the full workspace at `C:\Users\joshua\Desktop\Jirah Ops\` (or wherever your user folder is).

---

## 3. Configure your local env (one-time)

The dashboard needs to know where *your* OneDrive-synced client folder lives. This file is gitignored (each of us keeps our own).

```bash
cd dashboard
cp .env.local.example .env.local
```

Then open `dashboard/.env.local` in a text editor and uncomment/set:

```
ONEDRIVE_ROOT="C:\\Users\\joshua\\OneDrive - jirahgrowth.consulting\\Jason Lotoski's files - JIRAH Growth Partners - Shared\\NEW - JIRAH MASTER"
```

**Note:** the path starts with *your* Windows username (`joshua`) and references *Jason's* shared folder — it's the mirror of how Jason's looks on his machine. Double-backslashes are required (JSON escape).

---

## 4. Install dashboard dependencies (one-time)

From inside `dashboard/`:

```bash
npm install
```

Takes ~2 min. You'll see a `node_modules/` folder appear — that's gitignored, don't commit it.

---

## 5. Set your git identity (one-time, repo-scoped)

So commits are attributed to you:

```bash
cd ..   # back to Jirah Ops root
git config user.name "Joshua Marshall"
git config user.email "joshua@jirahgrowth.consulting"
```

(No `--global` flag — this only affects this repo.)

---

## 6. Start the dashboard

From the repo root:

```bash
./start-dashboard.bat
```

Or manually:

```bash
cd dashboard
npm run dev
```

Open http://localhost:3000. You should see the command center with live client data from OneDrive.

---

## Daily rhythm

**Every morning before you start work:**

```bash
cd "~/Desktop/Jirah Ops"
git pull
```

This grabs whatever Jason committed since you last pulled — new skills, dashboard changes, context updates.

**Every evening (or whenever you finish a change):**

```bash
git add .
git commit -m "short description of what changed"
git push
```

This sends your changes up so Jason gets them next time he pulls.

---

## What goes in git vs OneDrive

| Lives in git (this repo) | Lives in OneDrive (auto-syncs) |
|---|---|
| Dashboard code | Client files, profiles, deliverables |
| Claude skills + agents | Prospect folders, audit applications |
| Context IP (jirah-firm.md etc.) | Pipeline spreadsheet, corporate docs |
| CLAUDE.md, PLAN.md | Meeting transcripts, raw research |

Rule of thumb: **code and workspace config → git. Client/business data → OneDrive.**

---

## If something conflicts

If `git pull` says "merge conflict" (you and Jason both edited the same file):

1. Don't panic. Open the conflicted file — you'll see `<<<<<<<`, `=======`, `>>>>>>>` markers.
2. Pick which version wins (or combine), delete the markers.
3. `git add <file>` then `git commit` then `git push`.

If it looks scary, ping Jason — he can resolve it and push a fix.

---

## Claude Code memory (important)

Your personal Claude memory (`C:\Users\joshua\.claude\...`) is **separate from this repo** and stays on your machine. It's supposed to be personal — don't worry about syncing it. Jason's memory stays on his machine too.
