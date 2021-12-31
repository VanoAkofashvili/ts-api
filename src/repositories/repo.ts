import format from "pg-format";
import { Filter } from "./types";
import { pool } from '../services';
import { toCamelCase } from "../utils";

export abstract class Repository<T> {
  constructor(protected tableName: string) { }


  protected async _findOne(filter: Filter): Promise<T | null> {
    let queryStr = `SELECT * FROM %I WHERE `;
    const queryParams = [];

    for (let key in filter) {
      queryStr += '%I = %L AND ';
      queryParams.push(key, filter[key]);
    }

    queryStr = queryStr.replace(/AND $/, '');

    // Escape SQL identifiers and literals to avoid SQL Injection Exploit
    let result = await pool.query(format(queryStr, this.tableName, ...queryParams));

    if (result) {
      const data = result.rows as T[];
      const finalData: T = toCamelCase(data)[0]
      return finalData;
    }
    return null;
  }


}