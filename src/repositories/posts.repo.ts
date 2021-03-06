import { pool } from "../services";
import { toCamelCase } from "../utils";
import { Repository } from "./repo";
import { Filter } from "./types";

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
  // UNDER DEVELOPMENT
  private async latestPosts(userId: number) {
    const result = await pool.query(`
      SELECT * 
      FROM posts
      JOIN users ON users.id = posts.user_id
      ORDER_BY posts.created_at;
    `)
  }

  public async find(filter: Filter) {
    return await super.find(filter);
  }
}

export const Post = new PostRepo();
