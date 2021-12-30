import express from "express";
import { body } from "express-validator";
import { validateRequest } from "../middleware";
import { authController } from "../controllers/auth.controller";

const router = express.Router();

router.post('/signin', [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('You must supply a password')
], validateRequest, authController.signin);

router.post('/signup', [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').notEmpty().trim(),
  body('firstname').notEmpty().trim(),
  body('username').notEmpty().trim()
], authController.signup);

export default router;