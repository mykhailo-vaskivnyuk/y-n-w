exports.Worker = class Worker {
  async calculate(item) {
    await new Promise((rv) => setTimeout(rv, 300));
    return `result: ${item}`;
  }
};
