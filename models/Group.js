'use strict';
const Group = (sequelize, DataTypes) => {
    return sequelize.define('Group', {
        gid: {
            type: DataTypes.UUID,
            allowNull: false
        },
        shortcode: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ttl: {
            type: DataTypes.INTEGER,
            defaultValue: 24
        }
    }, {});
};
module.exports = Group;
//# sourceMappingURL=Group.js.map