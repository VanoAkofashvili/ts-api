import format from "pg-format";
import { Filter } from "./types";
import { pool } from '../services';
import { isEmpty, toCamelCase } from "../utils";

export abstract class Repository<T> {
  constructor(protected tableName: string) { }

  private selectAll(): string {
    return format(`SELECT * FROM %I`, this.tableName);
  }

  private generateSelectWhere(filter: Filter): string {
    if (isEmpty(filter)) return this.selectAll();

    let queryStr = 'SELECT * FROM %I WHERE ';
    const queryParams = [];

    for (let key in filter) {
      queryStr += '%I = %L AND ';
      queryParams.push(key, filter[key]);
    }

    queryStr = queryStr.replace(/AND $/, '');
    return format(queryStr, this.tableName, ...queryParams);
  }



  protected async findOne(filter: Filter): Promise<T | null> {
    if (isEmpty(filter)) return null;
    // Escape SQL identifiers and literals to avoid SQL Injection Exploit
    let query = this.generateSelectWhere(filter) + ' LIMIT 1;';
    let result = await pool.query(query);

    if (result) {
      const data = result.rows as T[];
      const finalData: T = toCamelCase(data)[0];
      return finalData;
    }
    return null;
  }

  protected async find(filter: Filter): Promise<T[]> {
    let query = this.generateSelectWhere(filter);
    let result = await pool.query(query);
    if (result) {
      const data = result.rows as T[];
      return toCamelCase(data);
    }
    return [];
  }

}