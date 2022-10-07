export const getEnumFromMap =
  <
    T extends Record<string | number, unknown>,
    Q extends Record<keyof T, keyof T>
  >(map: T): Q => 
    Object
      .keys(map)
      .reduce((obj, key) => {
        if (!isNaN(Number(key)) && Number.isInteger(key)) {
          Object.assign(obj, { [key]: +key });
        } else {
          Object.assign(obj, { [key]: key });
        }
        return obj;
      }, {} as Q);
