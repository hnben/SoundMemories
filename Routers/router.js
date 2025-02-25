import controller from '../Controllers/controller.js';
import { createContributionRequest } from '../Controllers/contributeController.js';
import express from 'express';

const router = express.Router();

//get all recordings
router.get('/home', controller.getAll);

//current available filters: happy, sad, encouraging, random
router.get('/getFiltered/:filter', controller.getFiltered);
router.post('/api/contribute/request', createContributionRequest);

export default router;