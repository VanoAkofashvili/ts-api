import { Request, Response, NextFunction } from "express";
import { Post } from "../repositories/posts.repo";
import { transformSuccess } from "../utils";

class PostsController {
  async create(req: Request, res: Response, next: NextFunction) {
    const { caption } = req.body;

    const newPost = await Post.create({ caption, userId: req.currentUser!.id });

    res.status(201).send(transformSuccess(newPost));

  }
}

export const postsController = new PostsController();