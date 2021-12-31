import { Request, Response, NextFunction } from "express";
import { Post } from "../repositories/posts.repo";

class PostsController {
  async create(req: Request, res: Response, next: NextFunction) {
    const { caption } = req.body;

    const newPost = await Post.create({ caption, userId: req.currentUser!.id });

    res.status(201).send(newPost);

  }
}

export const postsController = new PostsController();