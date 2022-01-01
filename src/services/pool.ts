import pg, { Pool as PoolType, PoolConfig } from "pg";

class Pool {
  private pool: null | PoolType = null;

  connect(options: PoolConfig) {
    this.pool = new pg.Pool(options);
    return this.pool.query('SELECT 1+1');
  }

  close() {
    return this.pool?.end();
  }

  query(sql: string, params?: unknown[]) {
    return this.pool?.query(sql, params);
  }

}

export const pool = new Pool();