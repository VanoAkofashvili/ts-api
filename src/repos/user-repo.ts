import { Password } from "../password";
import pool from "../pool";
import { toCamelCase } from "./utils/to-camel-case";

interface Filter {
  email: string;
}

interface User {
  email: string;
  username: string;
  firstname: string;
  password: string;
}

interface DBUser extends User {
  id: number,
  lastname: string;
  profilePicture: string,
  bio: string,
  createdAt: Date,
  updatetAt: Date,
  jwt?: string;
}

function omit<T extends object, U extends Extract<keyof T, string>>(obj: T) {
  return function (...keys: U[]): Omit<T, U> {
    let ret: any = {};
    const excludeSet: Set<string> = new Set(keys);
    for (let key in obj) {
      if (!excludeSet.has(key)) {
        ret[key] = obj[key];
      }
    }
    return ret;
  }
}

class User {
  static async findOne(filter: Filter) {
    const result = await pool.query('SELECT * FROM users WHERE email=$1 LIMIT 1;', [filter.email])
    if (result) {
      return toCamelCase(result.rows)[0];
    }
  };

  static async create({ email, username, firstname, password }: User) {
    const hashedPassword = await Password.toHash(password);

    const res = await pool.query(
      `INSERT INTO users (email, username, firstname, password) VALUES ($1, $2, $3, $4) RETURNING *`,
      [email, username, firstname, hashedPassword]
    );

    return omit(toCamelCase(res?.rows)[0] as DBUser)('password');
  }
}

export { User };