# Telnyx + Temporal Demo

Voice calls hit a Telnyx agent → agent sends a webhook → this app starts a Temporal Workflow (coffee order or greeting). No Temporal client needed; the webhook is the trigger.

**Tools:**
- **Telnyx** – Voice AI platform. The agent runs your conversation and forwards events to a URL you provide.
- **Temporal** – Workflow engine. Runs your Workflow (validate → pay → notify barista → confirm) with retries and durability.

---

## Prerequisites

- **Telnyx account** with credits ([telnyx.com](https://telnyx.com))
- **Temporal** running locally (default: `localhost:7233`). Use [Temporal CLI](https://docs.temporal.io/self-hosted-guide/quick-install) or Docker.
- **ngrok** (or similar) to expose your webhook to the internet

---

## Run

### 1. Start Temporal

If using Temporal CLI:

```bash
temporal server start-dev
```

### 2. Install and run the worker

```bash
npm install
npm run worker
```

Leave this running. It executes Workflows on task queue `melissas-cafe`.

### 3. Run the webhook server

In another terminal:

```bash
npm run webhook
```

Listens on **port 3000**, endpoint **POST `/webhook`**.

### 4. Expose with ngrok

In another terminal:

```bash
ngrok http 3000
```

Copy the **HTTPS** URL (e.g. `https://abc123.ngrok.io`).

### 5. Configure the Telnyx agent

1. In Telnyx: create an agent (voice AI) and get it assigned to a number or flow.
2. Set the agent’s **webhook URL** to:  
   `https://<your-ngrok-host>/webhook`  
   e.g. `https://abc123.ngrok.io/webhook`
3. When a call comes in, the agent can send a POST to this URL. This repo starts a Workflow from that request.

**Coffee order** – POST body must include:

- `drink` (e.g. `latte`, `cappuccino`, `americano`, `espresso`, `mocha`, `matcha`)
- `size` (`small`, `medium`, `large`)
- `customerName`

**Greeting** – POST body with `greeting` (string) runs the simple greeting Workflow instead.

---

## Summary

| Step | What |
|------|------|
| 1 | Temporal server running (`localhost:7233`) |
| 2 | `npm run worker` – runs Workflows |
| 3 | `npm run webhook` – receives Telnyx webhooks, starts Workflows |
| 4 | `ngrok http 3000` – public URL for the webhook |
| 5 | Telnyx agent webhook URL = `https://<ngrok-host>/webhook` |

Then: call → Telnyx agent → webhook → Temporal Workflow.
