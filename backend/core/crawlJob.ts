import { randomUUID } from "crypto";
import { crawlQueue } from "./crawlQueue";

export type JobStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

export class crawlJob {
    public readonly job_id: string;
    public readonly seed_url: string;
    public readonly allowed_host: string;
    public readonly queue: crawlQueue;

    public pages_crawled: number = 0;
    public status: JobStatus = "PENDING";
    public error?: string;

    public started_at?: Date;
    public completed_at?: Date;
    public created_at?: Date

    constructor(seedUrl: string) {
        this.job_id = randomUUID();
        this.seed_url = seedUrl;
        this.allowed_host = new URL(seedUrl).host;
        this.queue = new crawlQueue(seedUrl);
        this.created_at = new Date();
    }

    isAllowed(url: string): boolean {
        try {
            const urlHost = new URL(url).host;
            return urlHost === this.allowed_host;
        } catch {
            return false;
        }
    }

    markRunning(): void {
        if (this.status !== "PENDING") return;
        this.status = "RUNNING";
        this.started_at = new Date();
    }

    markCompleted(): void {
        if (this.status !== "RUNNING") return;
        this.status = "COMPLETED";
        this.completed_at = new Date();
    }

    markFailed(err: unknown): void {
        this.status = "FAILED";
        this.completed_at = new Date();
        this.error =
            err instanceof Error ? err.message : "Unknown error";
    }
}
