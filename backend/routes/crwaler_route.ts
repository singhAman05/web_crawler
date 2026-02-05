import {Router} from 'express';
import { crawlController } from '../controllers/crawl_controller';
const router = Router();

router.get('/crawl', crawlController);

export default router;