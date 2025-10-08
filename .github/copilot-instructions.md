## Repo quick-start for AI coding agents

This repository contains two small example integrations with the ICICI Direct BreezeConnect SDK: a Node.js script and a Python example. The goal of these instructions is to give an AI agent the minimal, concrete context needed to make safe, useful edits and run quick smoke-tests.

Key files
- `GetSharePrice.js` — Node.js example using `breezeconnect` (root).
- `package.json` — Node dependency manifest (shows `breezeconnect`).
- `pythonTest/iciciproject/ptest.py` — Python example using `breeze_connect` and showing data plotting and historical data call.
- `pythonTest/iciciproject/data.json` — example/sample data for tests or inspection.
- `pythonTest/iciciproject/env/` — a local Python virtualenv with installed packages (use this to run the Python example).

Big picture / architecture
- This is a small multi-language workspace (Node.js + Python) that demonstrates usage of the BreezeConnect SDK to call ICICI Direct APIs. There are no servers or long-lived services here — both scripts are client examples that call external APIs.
- Data flows: code builds a BreezeConnect client with an API key, generates a session using an API secret + token, then invokes SDK methods (e.g. `getDematHoldings()` in JS, `get_historical_data()` in Python) to retrieve data.

Important patterns & project conventions
- SDK usage differs by language naming style:
  - Node.js (root): uses BreezeConnect class with camelCase methods (e.g. `generateSession`, `getDematHoldings`). See `GetSharePrice.js`.
  - Python (`ptest.py`): uses snake_case methods (e.g. `generate_session`, `get_historical_data`). See `pythonTest/iciciproject/ptest.py`.
- Special-characters in API keys: both examples show URL-encoding the API key before embedding it in a login URL. Use `encodeURI` (JS) or `urllib.parse.quote_plus` (Python) when creating direct login URLs.
- Secrets currently live in example files. Do not expose or hardcode real credentials in patches or PR text. If you must alter credentials, prefer environment variables or a secrets file and document the change in the PR.

How to run / smoke-test
- Node (from repository root):
  - Ensure dependencies: `npm install` (if `node_modules` is missing or updated).
  - Run the example: `node GetSharePrice.js` — it prints a login URL and will attempt to generate a session and call `getDematHoldings()`.
- Python (use the included venv):
  - Activate venv: `source pythonTest/iciciproject/env/bin/activate` (macOS / zsh).
  - Run the example: `python pythonTest/iciciproject/ptest.py` — prints a login URL and calls `get_historical_data()`.
  - If the included venv is unsuitable, create a new one in that folder and `pip install` the packages the script imports (e.g. BreezeConnect SDK, pandas, matplotlib). There is no requirements.txt yet.

Integration points & external dependencies
- BreezeConnect / ICICI Direct API is the only external service of consequence. SDK packages exist for both Node (`breezeconnect`) and Python (`breeze_connect` / installed package in the venv).
- Both examples rely on network access to ICICI endpoints and valid API credentials/session tokens.

Editing guidance for AI agents
- When changing or adding API calls, update both language examples only if the change is cross-cutting and intended to be demonstrated in both samples.
- Preserve the patterns in each language (camelCase vs snake_case) and reuse the SDK method names shown in the examples.
- Avoid committing any real API keys or secrets. If you introduce config, prefer reading from environment variables (process.env in Node, os.environ in Python). If you add a `.env` or config file, add it to `.gitignore`.

Where to look for follow-up edits
- For Node: `GetSharePrice.js`, `package.json`, and `node_modules/` if you need to inspect installed SDK versions.
- For Python: `pythonTest/iciciproject/ptest.py`, `data.json`, and `pythonTest/iciciproject/env/lib/.../site-packages/` to see what packages are installed.

If anything here is unclear or you want more detail (for example, a requirements.txt, small unit tests, or a safe refactor to move secrets into env vars), tell me which area to expand and I will update this file.
