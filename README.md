<p align="center">
  <img src="icon.svg" alt="Paperclip Logo" width="21%">
</p>

# Paperclip on StartOS

> **Upstream repo:** <https://github.com/paperclipai/paperclip>
>
> **Upstream docs:** <https://github.com/paperclipai/paperclip/tree/main/docs>
>
> Everything not listed in this document should behave the same as upstream
> Paperclip. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable.

[Paperclip](https://paperclip.ing/) is an open-source platform for orchestrating teams of AI agents — define goals, assign agents to roles, and coordinate their work with budgets, approval workflows, and cost tracking from a single dashboard. It drives local agent CLIs (Claude Code, Codex, OpenCode) using your own LLM provider API keys.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Dependencies](#dependencies)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Property      | Value                                                            |
| ------------- | ---------------------------------------------------------------- |
| Image         | Built from the upstream `Dockerfile` (pinned via git submodule)  |
| Architectures | x86_64, aarch64                                                  |
| Entrypoint    | Upstream `docker-entrypoint.sh` + default command                |

The image is the upstream production image, which pre-installs the `claude`, `codex`, and `opencode` agent CLIs.

---

## Volume and Data Layout

| Volume   | Mount Point  | Purpose                                                                   |
| -------- | ------------ | ------------------------------------------------------------------------- |
| `main`   | `/paperclip` | All Paperclip data: embedded PostgreSQL, uploaded files, secrets master key |
| `startos`| (not mounted)| Holds `store.json` — StartOS-managed settings (see below)                 |

Paperclip uses its **embedded PostgreSQL** database by default; no external database is required. The data directory is set with `PAPERCLIP_HOME=/paperclip`.

---

## Installation and First-Run Flow

- A `BETTER_AUTH_SECRET` is generated automatically on install and stored in `store.json`.
- Paperclip runs in `authenticated` + `private` mode, so the **first person to sign up via the web UI becomes the instance admin**. There is no pre-seeded admin password.
- An **important task** is surfaced after install prompting you to set at least one LLM provider API key, since agents cannot run without one.

---

## Configuration Management

| StartOS-Managed (via actions / env vars)                          | Upstream-Managed (Paperclip's own UI)                       |
| ----------------------------------------------------------------- | ----------------------------------------------------------- |
| LLM provider API keys, new-user sign-ups, auth secret, deployment mode, bind host, trusted hostnames | Companies, agents, roles, goals, budgets, approvals, secrets vault, storage provider, and all other in-app settings |

StartOS injects the deployment-mode, hostname-trust, and auth environment variables on every start so the service is reachable over Tor/LAN without manual configuration. Per-company secrets (e.g. `GH_TOKEN`) are still managed inside Paperclip's own secrets vault.

---

## Network Access and Interfaces

| Interface | Port | Protocol | Purpose                  |
| --------- | ---- | -------- | ------------------------ |
| Web UI    | 3100 | HTTP     | Paperclip dashboard + API |

The same interface serves both the web dashboard and the REST API (`/api/...`). Every hostname StartOS assigns to the interface (`.onion`, `.local`, LAN IP) is automatically added to Paperclip's trusted-hostname allowlist (`PAPERCLIP_ALLOWED_HOSTNAMES`) and to Better Auth's trusted origins, so login works on each.

**Access methods:**

- LAN IP with unique port
- `<hostname>.local` with unique port
- Tor `.onion` address
- Custom domains (if configured)

---

## Actions (StartOS UI)

| Action                    | ID                  | Purpose                                                                 | Inputs                          | Output                |
| ------------------------- | ------------------- | ----------------------------------------------------------------------- | ------------------------------- | --------------------- |
| Set Provider API Keys     | `set-provider-keys` | Store the Anthropic and/or OpenAI API keys agents use; restarts service | Anthropic key, OpenAI key (both optional, masked) | Confirmation          |
| Manage New User Sign-Ups  | `manage-sign-ups`   | Allow or block new account registration; restarts service               | Allow sign-ups (toggle)         | Confirmation          |

Both actions are always visible and available in any status. Setting a provider key clears the post-install setup task.

---

## Backups and Restore

**Included in backup:**

- `main` volume (database, files, secrets master key)
- `startos` volume (`store.json`: auth secret, provider keys, sign-up setting)

**Restore behavior:** Both volumes are fully restored before the service starts, preserving accounts, data, and the auth secret.

---

## Health Checks

| Check         | Method                              | Grace Period | Messages                                                                        |
| ------------- | ----------------------------------- | ------------ | ------------------------------------------------------------------------------- |
| Web Interface | HTTP GET `/api/health` on port 3100 | 120s         | Success: "The web interface is ready" / Error: "The web interface is not ready" |

---

## Dependencies

None.

---

## Limitations and Differences

1. **Provider keys required for agents** — Paperclip itself runs without API keys, but agents cannot execute until you set at least one LLM provider key via the **Set Provider API Keys** action.
2. **`local_trusted` mode is not used** — StartOS requires a network-bound listener, which Paperclip only permits in `authenticated` mode. The service therefore always requires login.
3. **Embedded PostgreSQL only** — the package does not wire up an external/hosted PostgreSQL or S3 storage backend; both default to on-disk under `/paperclip`.

---

## What Is Unchanged from Upstream

Everything else. Company/agent/goal orchestration, budgets, governance and approval workflows, cost tracking, audit logging, the secrets vault, agent adapters, and the entire web UI behave exactly as documented upstream.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for build instructions and development workflow.

---

## Quick Reference for AI Consumers

```yaml
package_id: paperclip
architectures: [x86_64, aarch64]
volumes:
  main: /paperclip
  startos: store.json
ports:
  ui: 3100
dependencies: none
startos_managed_env_vars:
  - HOST
  - PORT
  - SERVE_UI
  - PAPERCLIP_HOME
  - PAPERCLIP_DEPLOYMENT_MODE
  - PAPERCLIP_DEPLOYMENT_EXPOSURE
  - PAPERCLIP_ALLOWED_HOSTNAMES
  - BETTER_AUTH_SECRET
  - PAPERCLIP_AUTH_DISABLE_SIGN_UP
  - ANTHROPIC_API_KEY
  - OPENAI_API_KEY
actions:
  - set-provider-keys
  - manage-sign-ups
```
