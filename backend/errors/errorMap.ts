export const ERROR_MAP = {
    INVALID_SEED_URL: {
        status: 400,
        message: "Invalid seed URL provided"
    },

    UNSUPPORTED_PROTOCOL: {
        status: 400,
        message: "Only http and https URLs are allowed"
    },

    INVALID_JOB_ID: {
        status: 400,
        message: "Invalid job ID"
    },

    NOT_FOUND: {
        status: 404,
        message: "Requested resource not found"
    },

    CRAWL_ALREADY_RUNNING: {
        status: 409,
        message: "A crawl job is already running"
    },

    JOB_CANCELLED: {
        status: 410,
        message: "Crawl job has been cancelled"
    },

    JOB_FAILED: {
        status: 500,
        message: "Crawl job failed"
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
