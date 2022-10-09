export const getEnumFromMap =
  <
    T extends Record<string | number, unknown>,
    Q extends Record<keyof T, keyof T>
  >(map: T): Q => 
    Object
      .keys(map)
      .reduce((obj, key) => {
        const value = isNaN(+key) ? key : +key;
        Object.assign(obj, { [key]: value });
        return obj;
      }, {} as Q);
