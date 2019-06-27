// merge two object arrays by '_key' field
export const mergeJsonArrays = (olderArr: any[], newerArr: any[]) => {
  const json = {};
  olderArr.forEach(d => {
    json[d._key] = d;
  });
  newerArr.forEach(d => {
    json[d._key] = d;
  });
  return Object.values(json);
};
