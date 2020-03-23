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

let SysInfoReq = require('./../models/SysInfo.js');
let EntryReq = require('./../models/Entry.js');
let GroupReq = require('./../models/Group.js');
let AuthorityReq = require('./../models/Authority.js');
let SysInfo = database.import('SysInfo', SysInfoReq);//models["SysInfo"];
let Entry = database.import('Entry', EntryReq);//models["Entry"];
let Group = database.import('Group', GroupReq);//models["Group"];
let Authority = database.import('Authority', AuthorityReq);//models["Authority"];

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
Entry.belongsTo(Authority);

// @ts-ignore
let Data: IDb = {
    seq: Sequelize,
    Op: Op,
    db: database,
    SysInfo, Group, Entry, Authority
};

export { Data }

// Interfaces
export interface IDb {
    SysInfo: any,
    Entry: any,
    Group: any,
    Authority: any,
    seq: any,
    db: any,
    Op: any
}
