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

interface Friend {
  userId: number;
  friendId: number;
  confirmed?: 'yes' | 'no';
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
      await pool.query(`
        INSERT INTO friends (user_id, friend_id)
        VALUES ($1, $2)
      `, [userId, friendId]);
      return true;
    } catch (err) {
      logError(err);
      return false;
    }

  }

  public async isFriend({ userId, friendId }: Friend): Promise<boolean> {
    const result = await pool.query(`
      SELECT *
      FROM friends
      WHERE user_id = $1 AND friend_id = $2;
    `, [userId, friendId])

    if (result?.rows.length) return true;
    return false;
  }

  public async hasRequestedFriendship({ userId, friendId }: Friend) {
    const result = await pool.query(`
      SELECT * 
      FROM friends
      WHERE friend_id = $1 AND user_id = $2 AND confirmed = false
    `, [userId, friendId])
    console.log(result?.rows)
    if (result?.rows.length) return true;
    return false;
  }

  public async removeFriendOrRequest({ userId, friendId }: Friend) {
    await pool.query(`
        DELETE FROM friends
        WHERE user_id = $1 AND friend_id = $2;
      `, [userId, friendId]);
  }

  public async acceptFriendRequest({ userId, friendId }: Friend) {
    await pool.query(`
      UPDATE friends
      SET confirmed = 'yes'
      WHERE friend_id = $1 AND user_id = $2 AND confirmed = 'no';
    `, [userId, friendId]);
  }
}

export const User = new UserRepo();