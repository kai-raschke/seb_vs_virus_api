'use strict';

const Entry = (sequelize, DataTypes) => {
    return sequelize.define('Entry', {
        uid: {
            type: DataTypes.UUID,
            allowNull: false
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        indexes:[
            {
                unique: true,
                fields:['uid']
            }
        ]
    });
};

module.exports = { models: [Entry]};
