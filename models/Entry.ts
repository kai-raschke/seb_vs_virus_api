'use strict';

const Entry = (sequelize, DataTypes) => {
    const E = sequelize.define('Entry', {
        uid: {
            type: DataTypes.UUID,
            allowNull: false
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false
        },
        alias: {
            type: DataTypes.STRING
        },
        token: {
            type: DataTypes.STRING
        },
        recovery: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        age: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        sex: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        lastCheck: {
            type: DataTypes.DATE
        }
    }, {
        indexes:[
            {
                unique: true,
                fields:['uid']
            }
        ]
    });

    return E;
};

module.exports = Entry;
