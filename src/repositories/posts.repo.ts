import { pool, Password } from "../services";
import { omit, toCamelCase } from '../utils';
import format from "pg-format";
import type { Filter } from './types';

interface DBPost {
  id: number,
  created_at: Date,
  updated_at: Date,
  url: string,
  user_id: number
  caption: string
  lat: number,
  lng: number
}

interface Post {

}

class Post {
  static async findOne(filter: Filter) {
    const result = await pool.query(format('SELECT * FROM posts WHERE email=$1 LIMIT 1;'), [filter.email])
    if (result) {
      return toCamelCase(result.rows)[0] as DBPost;
    }
  };

}

export { Post };