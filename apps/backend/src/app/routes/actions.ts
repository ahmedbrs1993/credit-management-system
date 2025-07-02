import { Router } from 'express';
import { postAction, getActions } from '../controllers/actions';

const router = Router();

router.get('/actions', getActions);
router.post('/actions', postAction);

export default router;
