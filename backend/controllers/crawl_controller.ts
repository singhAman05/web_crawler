import { Request, Response, NextFunction } from "express";
import { crawlService } from "../services/crawl_service";
import { validateInput } from "../utils/validateInput";

export const crawlController = async (req: Request,res: Response,next: NextFunction) => {
    try {
        const { seed_url } = req.body;
        const seedUrl = validateInput(seed_url);
        const result = await crawlService(seedUrl, 10);

        return res.status(200).json({
        message: "Crawl executed successfully",
        data: result
        });

    } catch (err) {
        next(err);
    }
};
