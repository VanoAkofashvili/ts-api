import { Password, pool } from "../services";
import { logError, logInfo, omit, toCamelCase } from '../utils';
import { Filter } from "./types";
import { Repository } from "./repo";

interface User {
  email: string;
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
  username: string;
  jwt?: string;
}

class UserRepo extends Repository<DBUser> {

  constructor() {
    super('users');
  }

  public async findOne(filter: Filter) {
    return await super.findOne(filter);
  }

  public async create({ email, firstname, password }: User) {
    const hashedPassword = await Password.toHash(password);

    const res = await pool.query(
      `INSERT INTO users (email, firstname, password) VALUES ($1, $2, $3) RETURNING *`,
      [email, firstname, hashedPassword]
    );

    // Transform object keys from snake_case to camelCase and Remove password field from the object
    return omit(toCamelCase(res?.rows)[0] as DBUser)('password');
  }

  public async addFriend(userId: number, friendId: number): Promise<boolean> {
    try {
      const result = await pool.query(`
        INSERT INTO friends (user_id, friend_id)
        VALUES ($1, $2)
      `, [userId, friendId]);
      return true;
    } catch (err) {
      logError(err);
      return false;
    }

  }
}

export const User = new UserRepo();