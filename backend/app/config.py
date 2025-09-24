import os

# Development-only hardcoded fallbacks. Leave empty by default.
# You can paste trial credentials here for quick local runs.
DATAFORSEO_API_LOGIN="vologom749@bitfami.com"
DATAFORSEO_API_PASSWORD="da6b6f3a134d5566"
DATAFORSEO_BASE_URL="https://api.dataforseo.com"
DATAFORSEO_API_KEY="dm9sb2dvbTc0OUBiaXRmYW1pLmNvbTpkYTZiNmYzYTEzNGQ1NTY2"

SERPAPI_KEY_DEV = "458f7216bea5a45315c9031011762e40e5babe31bc8f512ea03321353b926cbc"

ALLOWED_ORIGINS_DEV = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
]


def get_env(name: str, default: str = "") -> str:
    """Get env var with dev fallback constants above.
    This keeps local dev unblocked even if .env is missing.
    """
    val = os.getenv(name)
    if val:
        return val
    # map to dev constants
    if name == "DATAFORSEO_API_LOGIN":
        return DATAFORSEO_API_LOGIN or default
    if name == "DATAFORSEO_API_PASSWORD":
        return DATAFORSEO_API_PASSWORD or default
    if name == "DATAFORSEO_API_KEY":
        return DATAFORSEO_API_KEY or default
    if name == "DATAFORSEO_BASE_URL":
        return DATAFORSEO_BASE_URL or default
    if name == "SERPAPI_KEY":
        return SERPAPI_KEY_DEV or default
    if name == "ALLOWED_ORIGINS":
        return ",".join(ALLOWED_ORIGINS_DEV)
    return default
