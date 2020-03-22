'use strict';

const SysInfo = (sequelize, DataTypes) => {
    return sequelize.define('SysInfo', {
        key: {
            type: DataTypes.STRING,
            allowNull: false
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        freezeTableName: true,
    })
};

module.exports = SysInfo;
