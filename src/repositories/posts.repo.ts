import { pool } from "../services";
import { toCamelCase } from "../utils";
import { Repository } from "./repo";

interface Post {
  caption: string;
  userId: number;
}

interface DBPost {
  id: number,
  created_at: Date,
  updated_at: Date,
  url: string,
  caption: string
  lat: number,
  lng: number
}



class PostRepo extends Repository<DBPost> {
  constructor() {
    super('posts');
  }

  public async create(post: Post) {
    const result = await pool.query(`
      INSERT INTO posts (caption, user_id)
      VALUES ($1, $2) RETURNING *;
    `, [post.caption, post.userId]);

    if (result) {
      return toCamelCase(result.rows as DBPost[])
    }
  }
}

export const Post = new PostRepo();
