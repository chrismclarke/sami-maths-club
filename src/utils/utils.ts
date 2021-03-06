import { IDBDoc } from "src/models/common.model";

// merge two object arrays by '_key' field
export function mergeJsonArrays<T extends IDBDoc>(
  olderArr: T[],
  newerArr: T[]
): T[] {
  const json = {};
  olderArr.forEach(d => {
    json[d._key] = d;
  });
  newerArr.forEach(d => {
    json[d._key] = d;
  });
  return Object.values(json);
}

export function sortObjectArray<T>(arr: T[], sortField: string): T[] {
  return arr.sort((a, b) => (a[sortField] > b[sortField] ? 1 : -1));
}

// add escapes to string to use in regex
export function escapeRegexString(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// simple function used on mocks to simulate async request
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
