"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
let models = {}, modelArray = [], associations = [];
if (config_1.Config.db.dbUrl) {
    var database = new sequelize_1.Sequelize(config_1.Config.db.dbUrl, {
        dialect: config_1.Config.db.dialect,
        logging: false,
          dialectOptions: {
    ssl: true
  }
    });
}
else {
    var database = new sequelize_1.Sequelize(config_1.Config.db.name, config_1.Config.db.user, config_1.Config.db.pass, {
        dialect: config_1.Config.db.dialect,
        logging: false
    });
}
let SysInfoReq = require('./../models/SysInfo.js');
let EntryReq = require('./../models/Entry.js');
let GroupReq = require('./../models/Group.js');
let AuthorityReq = require('./../models/Authority.js');
let SysInfo = database.import('SysInfo', SysInfoReq);
let Entry = database.import('Entry', EntryReq);
let Group = database.import('Group', GroupReq);
let Authority = database.import('Authority', AuthorityReq);
Entry.belongsToMany(Entry, {
    as: 'Met',
    through: 'connection'
});
Entry.belongsToMany(Group, {
    as: 'Member',
    through: 'GroupMember'
});
Entry.belongsTo(Authority);
let Data = {
    seq: sequelize_1.Sequelize,
    Op: sequelize_1.Op,
    db: database,
    SysInfo, Group, Entry, Authority
};
exports.Data = Data;
//# sourceMappingURL=db.js.map
