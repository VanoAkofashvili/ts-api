import pg, { Pool as PoolType, PoolConfig } from "pg";

class Pool {
  private _pool: null | PoolType = null;

  connect(options: PoolConfig) {
    this._pool = new pg.Pool(options);
    return this._pool.query('SELECT 1+1');
  }

  close() {
    if (this._pool) {
      return this._pool.end();
    }
  }

  query(sql: string, params: unknown[]) {
    return this._pool?.query(sql, params);
  }

}

export default new Pool();