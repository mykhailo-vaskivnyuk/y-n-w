export class SyncCalc {
  constructor(
    private data?: unknown,
    private error?: unknown,
  ) {}

  next(fn: (arg: any) => unknown) {
    if (this.error) return this;
    try {
      const data = fn(this.data);
      return this.withData(data);
    } catch (e) {
      return this.withError(e);
    }
  }

  onerror(fn: (arg: any) => unknown) {
    if (!this.error) return this;
    try {
      const data = fn(this.error);
      return this.withData(data);
    } catch (e) {
      return this.withError(e);
    }
  }

  debug(fn: (data?: any, error?: any) => void) {
    try {
      fn(this.data, this.error);
      return this;
    } catch {
      return this;
    }
  }

  private withData(data: unknown) {
    this.error = undefined;
    this.data = data;
    return this;
  }

  private withError(error: unknown) {
    this.error = error;
    this.data = undefined;
    return this;
  }

  end() {
    if (this.error) throw this.error;
    return this.data;
  }
}

export const asyncCalc = Promise.resolve.bind(Promise);
