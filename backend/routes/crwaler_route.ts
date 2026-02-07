import {Router} from 'express';
import { startCrawl, getCrawlStatus } from '../controllers/crawl_controller';
const router = Router();

router.post('/startJob', startCrawl);
router.get('/:jobId', getCrawlStatus);
export default router;