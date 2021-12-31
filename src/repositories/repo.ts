import type { Filter } from "./types";

export abstract class Repository {
  static findOne(filter: Filter): undefined {
    return undefined;
  };
}