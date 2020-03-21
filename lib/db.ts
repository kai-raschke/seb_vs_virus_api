import * as path from "path";
import * as fs from 'fs';

import { Sequelize, Model, Op } from "sequelize";

import { Config } from '../config';
import { log } from './log';

let models = {}, modelArray = [], associations = [];

// Heroku uses preconfigured database url, otherwise use values from config
if (Config.db.dbUrl) {
    var database = new Sequelize(Config.db.dbUrl, {
        dialect: Config.db.dialect,
        logging: false
    });
}
else {
    var database = new Sequelize(Config.db.name, Config.db.user, Config.db.pass, {
        dialect: Config.db.dialect,
        logging: false
    });
}

// Query all database models
let modules = fs.readdirSync(path.join(__dirname, '/..', 'models'));
for(let k = -1; ++k < modules.length;){
    if (modules[k].indexOf('.ts') == -1 && modules[k].indexOf('.map') == -1) {
        let mod = require('./../models/' + modules[k]);
        modelArray = modelArray.concat(mod.models);

        if (mod.Associations)
            associations.push(mod.Associations);
    }
}

// Import all queried models into sequelize
// for(let m = -1; ++m < modelArray.length;){
//     let model = database.import(modelArray[m].name, modelArray[m]);
//     models[model.name] = model;
// }

// List of models with typings
// let SysInfo: ISysInfo = models["SysInfo"];
// let Entry: IEntry = models["Entry"];
// let Group: IGroup = models["Group"];

let SysInfo = database.import(path.join('..', 'models', 'SysInfo.js'));//models["SysInfo"];
let Entry = database.import(path.join('..', 'models', 'Entry.js'));//models["Entry"];
let Group = database.import(path.join('..', 'models', 'Group.js'));//models["Group"];

// Entry.associate = function() {
// @ts-ignore
Entry.belongsToMany(
    Entry,
    {
        as: 'Met',
        through: 'connection'
    }
);

// @ts-ignore
Entry.belongsToMany(
    Group,
    {
        as: 'Member',
        through: 'GroupMember'
    }
);

// @ts-ignore
Group.belongsToMany(
    Entry,
    {
        as: 'Member',
        through: 'GroupMember'
    }
);
// };

// Associate
// Entry.associate();

// @ts-ignore
let Data: IDb = {
    seq: Sequelize,
    Op: Op,
    db: database,
    SysInfo, Group, Entry
};

export { Data }

// Interfaces
export interface IDb {
    SysInfo: any,
    Entry: any,
    Group: any,
    seq: any,
    db: any,
    Op: any
}

interface ISysInfo extends Model {
    version: string;
    create: Function;
}

interface IEntry extends Model {
    associate: () => void;
    create: Function,
    findOne: Function,
    findAll: Function,
    uid: string

    belongsToMany(model: any, options: { through: string; as: string }): void;
}

interface IGroup extends Model {
    create: Function,
    findOne: Function,
    findAll: Function,
    gid: string,
    shortcode: string

    belongsToMany(Entry: IEntry, options: { through: string; as: string }): void;
}
