export const ERROR_MAP = {
    INVALID_SEED_URL: {
        status: 400,
        message: "Invalid seed URL provided"
    },

    UNSUPPORTED_PROTOCOL: {
        status: 400,
        message: "Only http and https URLs are allowed"
    },

    CRAWL_ALREADY_RUNNING: {
        status: 409,
        message: "A crawl job is already running"
    },

    MAX_PAGES_EXCEEDED: {
        status: 400,
        message: "Requested maxPages exceeds allowed limit"
    },

    FETCH_FAILED: {
        status: 502,
        message: "Failed to fetch page"
    },

    HTML_PARSE_FAILED: {
        status: 500,
        message: "Failed to parse HTML"
    },

    RATE_LIMITED: {
        status: 429,
        message: "Too many crawl requests"
    },

    SERVICE_UNAVAILABLE: {
        status: 503,
        message: "Crawler service unavailable"
    },

    INTERNAL_ERROR: {
        status: 500,
        message: "Internal server error"
    }
} as const;
