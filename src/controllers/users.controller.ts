import { Request, Response } from "express";
import { BadRequestError } from "../errors";
import { User } from "../repositories/users.repo";
import { Password } from "../services";
import { config, omit, transformSuccess } from "../utils";
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
    }, config.JWT_KEY)

    existingUser.jwt = userJwt;

    res.status(200).send(transformSuccess(omit(existingUser)('password')));
  }

  async signup(req: Request, res: Response) {
    const { email, password, firstname } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const user = await User.create({ email, password, firstname });

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      config.JWT_KEY
    )
    user.jwt = userJwt;

    res.status(201).send(transformSuccess(user));
  }

  currentUser(req: Request, res: Response) {
    res.send(transformSuccess(req.currentUser));
  }

  async addFriend(req: Request, res: Response) {
    const friendId = req.body.friendId;
    const result = await User.addFriend(req.currentUser!.id, friendId);

    if (result)
      return res.status(201).send(transformSuccess());
    else
      throw new BadRequestError("Friend can't be added");
  }

  async removeFriendOrRequest(req: Request, res: Response) {
    const friendId = Number(req.body.friendId);
    const userId = req.currentUser!.id;

    const isFriends = await User.isFriend({ userId, friendId });
    if (!isFriends) throw new BadRequestError('Something went wrong');

    await User.removeFriendOrRequest({ userId, friendId })
    return res.send(transformSuccess());
  }

  async acceptFriendRequest(req: Request, res: Response) {
    const userId = req.currentUser!.id;
    const friendId = req.body.friendId;
    console.log(userId);
    if (await User.hasRequestedFriendship({ userId, friendId })) {
      await User.acceptFriendRequest({ userId, friendId });
      return res.send(transformSuccess());
    }
    throw new BadRequestError("Can't add user");

  }
}

export const usersController = new UsersController();



