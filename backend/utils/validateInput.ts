import { AppError } from "../errors/appError";

export const validateInput = (seedUrl: unknown, maxPages: number): string => {
    if (typeof seedUrl !== "string" || seedUrl.trim() === "") {
        throw new AppError("INVALID_SEED_URL");
    }

    if (maxPages > 50) {
        throw new AppError("MAX_PAGES_EXCEEDED");
    }

    let url: URL;

    try {
        url = new URL(seedUrl);
    } catch {
        throw new AppError("INVALID_SEED_URL");
    }

    if (!["http:", "https:"].includes(url.protocol)) {
        throw new AppError("UNSUPPORTED_PROTOCOL");
    }

    // normalize URL (important for dedup)
    return url.toString();
}
