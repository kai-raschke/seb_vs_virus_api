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
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['uid']
            }
        ]
    });
    E.associate = function (models) {
        E.belongsToMany(E, {
            as: 'Met',
            through: 'connection'
        });
        E.belongsToMany(models.Group, {
            as: 'Member',
            through: 'GroupMember'
        });
    };
    return E;
};
module.exports = { models: [Entry] };
//# sourceMappingURL=Entry.js.map