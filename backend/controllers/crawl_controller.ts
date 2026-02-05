import {Request, Response} from 'express';
import { crawlService } from '../services/crawl_service';
import { validateInput } from '../utils/validateInput';


export const crawlController = async(req: Request, res: Response) => {
    const { seed_url } = req.body
    await validateInput(seed_url);
    console.log('Crawl controller is running');
    crawlService();
    res.status(200).send({message: 'Crawl executed successfully'});
}