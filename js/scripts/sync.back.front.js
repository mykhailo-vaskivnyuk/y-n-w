"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const runSync = async () => {
    console.log('from BACK to FRONT');
    await (0, utils_1.copyDir)(constants_1.backPath, constants_1.frontPath, constants_1.fromBackToFront);
    console.log('\nfrom FRONT to BACK');
    await (0, utils_1.copyDir)(constants_1.frontPath, constants_1.backPath, constants_1.fromFrontToBack);
};
runSync();
//# sourceMappingURL=sync.back.front.js.map