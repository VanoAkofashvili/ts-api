import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { Password } from "../password";
import { User } from "../repos/user-repo";


const router = express.Router();

router.post('/signin', [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('You must supply a password')
], async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return res.send({ error: "user not found" });
  }

  const passwordMatch = await Password.compare(
    existingUser.password,
    password
  );

  if (!passwordMatch) {
    return res.send({ error: "invalid credintials" });
  }

  // Generate JWT
  const userJwt = jwt.sign({
    id: existingUser.id,
    email: existingUser.email
  }, process.env.JWT_KEY!)

  existingUser.jwt = userJwt;

  res.status(200).send(existingUser);



});

router.post('/signup', [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim(),
  body('firstname').trim(),
  body('username').trim()
], async (req: Request, res: Response) => {
  const { email, password, firstname, username } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error('user already exists');
  }

  const user = await User.create({ email, password, firstname, username });

  // Generate JWT
  const userJwt = jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    process.env.JWT_KEY!
  )
  user.jwt = userJwt;

  res.status(201).send(user);

});

export default router;