import pg from "pg";

class Pool {
  private pool = null;

  connect(options) {
    this.pool = new pg.Pool()
  }
}

export default new Pool();