/* eslint-disable func-names */
/* eslint-disable no-param-reassign */

async function asyncFunction() {
  return null;
}
const asyncFunctionConstructor = Object.getPrototypeOf(asyncFunction);
const isAsync = (fn: (...args: any[]) => any) =>
  Object.getPrototypeOf(fn) === asyncFunctionConstructor;

export const decorateAsync = <
  T extends { new(...args: any[]): any},
> (
  target: T,
  methodName: string,
  operation: () => void | Promise<void>,
) => {
  const method = target.prototype[methodName];

  if (isAsync(method) || isAsync(operation)) {
    target.prototype[methodName] = async function(
      ...args: Parameters<typeof method>
    ) {
      let result;
      if (isAsync(method)) result = await method.apply(this, args);
      else result = method.apply(this, args);
      if (isAsync(operation)) await operation();
      else operation();
      return result;
    }
  }

  target.prototype[methodName] = function(
    ...args: Parameters<typeof method>
  ) {
    const result = method.apply(this, args);
    operation();
    return result;
  }
}
