import { randomUUID } from "crypto";
import { crawlQueue } from "./crawlQueue";

export class crawlJob{
    public readonly job_id : string;
    public readonly seed_url : string;
    public readonly allowed_host: string;
    public readonly queue : crawlQueue;
    pages_crawled : number = 0;

    constructor(seedUrl : string){
        this.job_id = randomUUID();
        this.seed_url = seedUrl;
        this.allowed_host = new URL(seedUrl).host;
        this.queue = new crawlQueue(seedUrl);
    }

    isAllowed(url : string) : boolean{
        try{
            const urlHost = new URL(url).host;
            return urlHost === this.allowed_host;
        }catch{
            return false
        }
    }
}