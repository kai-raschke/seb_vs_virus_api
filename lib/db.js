"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
let models = {}, modelArray = [], associations = [];
if (config_1.Config.db.dbUrl) {
    var database = new sequelize_1.Sequelize(config_1.Config.db.dbUrl, {
        dialect: config_1.Config.db.dialect,
        logging: false
    });
}
else {
    var database = new sequelize_1.Sequelize(config_1.Config.db.name, config_1.Config.db.user, config_1.Config.db.pass, {
        dialect: config_1.Config.db.dialect,
        logging: false
    });
}
let modules = fs.readdirSync(path.join(__dirname, '/..', 'models'));
for (let k = -1; ++k < modules.length;) {
    if (modules[k].indexOf('.ts') == -1 && modules[k].indexOf('.map') == -1) {
        let mod = require('./../models/' + modules[k]);
        modelArray = modelArray.concat(mod.models);
        if (mod.Associations)
            associations.push(mod.Associations);
    }
}
for (let m = -1; ++m < modelArray.length;) {
    let model = database.import(modelArray[m].name, modelArray[m]);
    models[model.name] = model;
}
let SysInfo = models["SysInfo"];
let Entry = models["Entry"];
let Group = models["Group"];
Entry.associate(models);
let Data = {
    seq: sequelize_1.Sequelize,
    Op: sequelize_1.Op,
    db: database,
    SysInfo,
    Entry,
    Group
};
exports.Data = Data;
//# sourceMappingURL=db.js.map