import express from "express";
import { body } from "express-validator";
import { postsController } from "../controllers";
import { validateRequest } from "../middleware";
import { requireAuth } from "../middleware/require-auth";
const router = express.Router();

router.post('/', requireAuth, [
  body('caption').not().isEmpty().withMessage('Caption must be provided')
], validateRequest, postsController.create);

export default router;