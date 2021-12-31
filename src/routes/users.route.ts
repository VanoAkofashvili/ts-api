import express from "express";
import { body } from "express-validator";
import { validateRequest } from "../middleware";
import { usersController } from "../controllers";
import { User } from "../repositories/users.repo";
import { requireAuth } from "../middleware/require-auth";
import { logInfo } from "../utils";

const router = express.Router();

router.post('/signin', [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('You must supply a password')
], validateRequest, usersController.signin);

router.post('/signup', [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').notEmpty().trim(),
  body('firstname').notEmpty().trim(),
], validateRequest, usersController.signup);

router.get('/currentuser', usersController.currentUser);

router.post('/addfriend', requireAuth, [
  body('friendId').not().isEmpty().withMessage('You must supply friend id')
], usersController.addFriend);


router.post('/find', requireAuth, async (req, res, next) => {

  logInfo(req.body.email);
  const user = await User.findOne({ email: req.body.email });
  logInfo(user);
  return res.send(user)
})

export default router;