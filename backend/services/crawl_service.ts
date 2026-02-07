import axios from "axios";
import * as cheerio from "cheerio";
import { crawlJob } from "../core/crawlJob";
import { AppError } from "../errors/appError";

export async function crawlService(job:crawlJob,maxPages: number) {
    if (maxPages <= 0) {
        throw new AppError("MAX_PAGES_EXCEEDED");
    }

    while(!job.queue.isEmpty() && job.pages_crawled < maxPages) {
        const current_url = job.queue.dequeue();
        if(!current_url){
            continue;
        }
        try{
            const response = await axios.get(current_url, {timeout: 5000,validateStatus: (status) => status < 500});
            job.pages_crawled++;
            const html = response.data;
            const dom = cheerio.load(html);

            dom("a[href]").each((_, el) => {
                const href = dom(el).attr("href");
                if (!href) return;

                try {
                    const absoluteUrl = new URL(href, current_url).toString();

                    if (!job.isAllowed(absoluteUrl)) return;
                    if (job.queue.hasVisited(absoluteUrl)) return;

                    job.queue.enqueue(absoluteUrl);
                } catch (err) {
                // ignore malformed URLs
                    console.warn(`Skipping invalid URL: ${href} found on ${current_url}`);
                }
            });
        }catch(err){
            console.error(`Error crawling ${current_url}:`, err);
            continue;
        }
    }

    return {
        jobId: job.job_id,
        seedUrl: job.seed_url,
        pagesCrawled: job.pages_crawled,
        discoveredUrls: job.queue.visitedCount(),
    };
}
