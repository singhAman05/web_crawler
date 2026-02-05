import axios from "axios";
import * as cheerio from "cheerio";
import { crawlQueue } from "../core/crawlQueue";
import { AppError } from "../errors/appError";

export async function crawlService(seedUrl: string,maxPages: number) {
    if (maxPages <= 0) {
        throw new AppError("MAX_PAGES_EXCEEDED");
    }

    const queue = new crawlQueue(seedUrl);
    let pagesCrawled = 0;

    while (!queue.isEmpty() && pagesCrawled < maxPages) {
        const currentUrl = queue.dequeue();
        if (!currentUrl) continue;

        try {
        const response = await axios.get(currentUrl, {
            timeout: 5000,
            validateStatus: (status) => status < 500
        });

        const html = response.data;
        pagesCrawled++;

        const dom = cheerio.load(html);

        dom("a[href]").each((_, el) => {
            const href = dom(el).attr("href");
            if (!href) return;

            try {
            const absoluteUrl = new URL(href, currentUrl).toString();
            queue.enqueue(absoluteUrl);
            } catch {
            // ignore invalid or non-http URLs
            }
        });

        } catch (err) {
            // page-level failure → log and continue
            console.error(`Failed to crawl ${currentUrl}`);
            console.log(`Error: ${err}`);
        }
    }

    return {
        seedUrl,
        pagesCrawled,
        discoveredUrls: queue.maxDepth()
    };
}
