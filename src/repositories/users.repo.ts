import { Password } from "../services/password";
import { pool } from "../services";
import { omit, toCamelCase } from "./utils";

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

class User {
  static async findOne(filter: Filter) {
    const result = await pool.query('SELECT * FROM users WHERE email=$1 LIMIT 1;', [filter.email])
    if (result) {
      return omit(toCamelCase(result.rows)[0] as DBUser)('password');
    }
  };

  static async create({ email, username, firstname, password }: User) {
    const hashedPassword = await Password.toHash(password);

    const res = await pool.query(
      `INSERT INTO users (email, username, firstname, password) VALUES ($1, $2, $3, $4) RETURNING *`,
      [email, username, firstname, hashedPassword]
    );

    // Transform object keys from snake_case to camelCase and Remove password field from the object
    return omit(toCamelCase(res?.rows)[0] as DBUser)('password');
  }
}

export { User };