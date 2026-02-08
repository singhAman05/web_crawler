import { Request, Response, NextFunction } from "express";
import { crawl_Manager } from "../core/crawlManager";
import { validateInput } from "../utils/validateInput";
import { AppError } from "../errors/appError";

export const startCrawl = async (req: Request,res: Response,next: NextFunction) => {
    try {
        let { seedUrl, maxPages=20 } = req.body;
        seedUrl = validateInput(seedUrl,maxPages);
        const job = crawl_Manager.startJob(seedUrl, maxPages);

        return res.status(202).json({
            message: "Crawl job started",
            job_id: job.job_id,
            seed_url: job.seed_url
        });

    } catch (err) {
        next(err);
    }
};

export const getCrawlStatus = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const rawJobId = req.params.jobId;

        const jobId = Array.isArray(rawJobId)
            ? rawJobId[0]
            : rawJobId;

        if (!jobId) {
            throw new AppError("INVALID_JOB_ID");
        }

        const job = crawl_Manager.getJob(jobId);
        if (!job) {
            throw new AppError("NOT_FOUND");
        }
        return res.status(200).json({
            jobId: job.job_id,
            status: job.status,
            seedUrl: job.seed_url,
            pagesCrawled: job.pages_crawled,
            discoveredUrls: job.queue.visitedCount(),
            createdAt: job.created_at,
            startedAt: job.started_at ?? null,
            completedAt: job.completed_at ?? null,
            error: job.error ?? null
        });
    }catch(err){
        next(err);
    }
}
