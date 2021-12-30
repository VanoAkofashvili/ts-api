import { Request, Response } from "express";
import { BadRequestError, RequestValidationError } from "../errors";
import { User } from "../repositories/users.repo";
import { Password } from "../services";
import jwt from "jsonwebtoken";

class UsersController {

  async signin(req: Request, res: Response) {

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid Credentials');
    }

    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordMatch) {
      throw new BadRequestError('Invalid Credentials')
    }

    // Generate JWT
    const userJwt = jwt.sign({
      id: existingUser.id,
      email: existingUser.email
    }, process.env.JWT_KEY!)

    existingUser.jwt = userJwt;

    res.status(200).send(existingUser);
  }

  async signup(req: Request, res: Response) {
    const { email, password, firstname, username } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
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
  }

  currentUser(req: Request, res: Response) {
    res.send({ currentUser: req.currentUser || null })
  }
}

export const usersController = new UsersController();



