import { Password, pool } from "../services";
import { omit, toCamelCase } from '../utils';
import { Filter } from "./types";
import { Repository } from "./repo";

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

class UserRepo extends Repository<DBUser> {

  constructor() {
    super('users');
  }

  public async findOne(filter: Filter) {
    return await super._findOne(filter);
  }

  public async create({ email, username, firstname, password }: User) {
    const hashedPassword = await Password.toHash(password);

    const res = await pool.query(
      `INSERT INTO users (email, username, firstname, password) VALUES ($1, $2, $3, $4) RETURNING *`,
      [email, username, firstname, hashedPassword]
    );

    // Transform object keys from snake_case to camelCase and Remove password field from the object
    return omit(toCamelCase(res?.rows)[0] as DBUser)('password');
  }
}

export const User = new UserRepo();
