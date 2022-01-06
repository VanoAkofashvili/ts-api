import express from "express";
import { body } from "express-validator";
import { validateRequest } from "../middleware";
import { usersController } from "../controllers";
import { User } from "../repositories/users.repo";
import { requireAuth } from "../middleware/require-auth";
import { logInfo } from "../utils";
import { BadRequestError } from "../errors";

const router = express.Router();

router.post('/signin', [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('You must supply a password')
], validateRequest, usersController.signin);

router.post('/signup', [
  body('email').exists().notEmpty().withMessage('Email is required').isEmail().withMessage('Email is invalid'),
  body('password').trim().notEmpty().withMessage('Password is required').isLength({ min: 4 }).withMessage('Invalid password, minimum length: 4'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new BadRequestError('Password confirmation does not match password')
    }

    return true;
  }),
  body('firstname').trim().exists().notEmpty()
], validateRequest, usersController.signup);

router.get('/currentuser', usersController.currentUser);

router.post('/addfriend', requireAuth, [
  body('friendId').not().isEmpty().withMessage('FriendId is required').isInt({ min: 0 }).withMessage('Invalid value')
], validateRequest, usersController.addFriend);

router.post('/removefriend', requireAuth, [
  body('friendId').not().isEmpty().withMessage('FriendId is required').isInt({ min: 0 }).withMessage('Invalid value')
], validateRequest, usersController.removeFriendOrRequest);

router.post('/acceptfriendrequest', requireAuth, [
  body('friendId').not().isEmpty().withMessage('FriendId is required').isInt({ min: 0 }).withMessage('Invalid value')
], validateRequest, usersController.acceptFriendRequest);

// TEST ROUTE
router.post('/find', requireAuth, async (req, res, next) => {

  logInfo(req.body.email);
  const user = await User.findOne({ email: req.body.email });
  logInfo(user);
  return res.send(user)
})

export default router;