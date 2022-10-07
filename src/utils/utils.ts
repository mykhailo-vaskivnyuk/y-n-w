export const getEnumFromMap =
  <T extends Record<string, unknown>, Q extends Record<keyof T, keyof T>>(map: T): Q => 
    Object
      .keys(map)
      .reduce((obj, key) =>
        Object.assign(obj, { [key]: key }), {} as Q);
