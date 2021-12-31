import format from "pg-format";
import { Password, pool } from "../services";
import { omit, toCamelCase } from '../utils';


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

interface Filter {
  [key: string]: string | number;
}



abstract class Repository<T> {
  constructor(public tableName: string) { }

  protected async _findOne(filter: Filter): Promise<T | null> {
    console.log(filter);
    let queryStr = `SELECT * FROM %I WHERE `;
    const queryParams = [];

    for (let key in filter) {
      queryStr += '%I = %L AND ';
      queryParams.push(key, filter[key]);
    }
    queryStr = queryStr.replace(/AND $/, '');
    // Escape SQL identifiers and literals to avoid SQL Injection Exploit

    let result;
    try {
      result = await pool.query(format(queryStr, this.tableName, ...queryParams));
    } catch (err) {
      console.log(err);
    }

    if (result) {
      const data = result.rows as T[];
      const finalData: T = toCamelCase(data)[0]
      return finalData;
    }
    return null;
  }
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
