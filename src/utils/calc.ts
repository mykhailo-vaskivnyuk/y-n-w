export class SyncCalc {
  constructor(private data?: unknown, private error?: unknown) {}

  next(fn: (arg: any) => unknown) {
    if (this.error) return this;
    try {
      const data = fn(this.data);
      return new SyncCalc(data);
    } catch (e) {
      return new SyncCalc(undefined, e);
    }
  }

  onerror(fn: (arg: any) => unknown) {
    if (!this.error) return this;
    try {
      const data = fn(this.error);
      return new SyncCalc(data);
    } catch (e) {
      return new SyncCalc(undefined, e);
    }
  }

  end() {
    if (this.error) throw this.error;
    return this.data;
  }
}

export const asyncCalc = Promise.resolve.bind(Promise);
