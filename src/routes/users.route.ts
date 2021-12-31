import express from "express";
import { body } from "express-validator";
import { currentUser, validateRequest } from "../middleware";
import { usersController } from "../controllers";
import { requireAuth } from "../middleware/require-auth";
import { User } from "../repositories/users.repo";

const router = express.Router();

router.post('/signin', [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('You must supply a password')
], validateRequest, usersController.signin);

router.post('/signup', [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').notEmpty().trim(),
  body('firstname').notEmpty().trim(),
  body('username').notEmpty().trim()
], validateRequest, usersController.signup);

router.get('/currentuser', usersController.currentUser);
router.post('/find', async (req, res, next) => {
  // console.log(req);
  // console.log(email);
  const user = await User.findOne({ email: req.body.email });
  return res.send(user)
})
export default router;