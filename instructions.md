# Paperclip

## Documentation

- [Paperclip docs](https://github.com/paperclipai/paperclip/tree/main/docs) — the upstream documentation, including guides for companies, agents, and adapters.
- [Deployment notes](https://github.com/paperclipai/paperclip/tree/main/docs/deploy) — upstream reference for environment variables and runtime behavior.

## What you get on StartOS

- A single **Web UI** interface (port 3100) that serves both the Paperclip dashboard and its REST API, reachable over LAN, `.local`, and Tor.
- An **embedded PostgreSQL** database and on-disk storage — no external database to set up.
- Login is always required (Better Auth), and the first account you create becomes the instance admin.

## Getting set up

1. Open the **Web UI** from the **Dashboard** tab and create your account. The first account to sign up becomes the admin.
2. Run the **Set Provider API Keys** action and enter an Anthropic and/or OpenAI API key. Agents cannot run until at least one key is set — a setup task will remind you. The service restarts to apply the keys.
3. Once you are signed in and keys are set, create a company, add agents, and assign goals from the dashboard.

> Bring your own LLM provider keys. Paperclip runs the `claude`, `codex`, and `opencode` agent CLIs inside the service using the keys you provide.

## Using Paperclip

### Web interface

After login you land on the Paperclip dashboard, where you define business goals, assign AI agents to roles, and track their tasks, budgets, and approvals.

### Actions

- **Set Provider API Keys** — store or update the Anthropic / OpenAI keys your agents use. Run it whenever you rotate a key.
- **Manage New User Sign-Ups** — once your account exists, run this and turn sign-ups off so no one else can register on your instance. Turn it back on temporarily when you want to add a teammate.
