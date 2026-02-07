import { crawlJob } from "./crawlJob";
import { crawlService } from "../services/crawl_service";
import { AppError } from "../errors/appError";

export class crawlManager {
    private jobs = new Map<string, crawlJob>();

    startJob(seedUrl: string, maxPages: number): crawlJob {
        const job = new crawlJob(seedUrl);

        if (this.jobs.has(job.job_id)) {
            throw new AppError("CRAWL_ALREADY_RUNNING");
        }

        this.jobs.set(job.job_id, job);

        // fire-and-forget execution
        (async () => {
            try {
                job.markRunning();
                await crawlService(job, maxPages);
                job.markCompleted();
            } catch (err) {
                const message = err instanceof Error ? err.message : "Unknown error";
                job.markFailed(message);
                console.error(`Job ${job.job_id} failed: ${message}`);
            }
        })();

        return job;
    }

    getJob(jobId: string): crawlJob | undefined {
        return this.jobs.get(jobId);
    }
}

export const crawl_Manager = new crawlManager();
