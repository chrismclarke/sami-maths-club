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
