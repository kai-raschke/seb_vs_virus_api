'use strict';

const SysInfo = (sequelize, DataTypes) => {
    return sequelize.define('SysInfo', {
        version: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        freezeTableName: true,
    })
};

module.exports = { models: [SysInfo]};
