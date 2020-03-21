'use strict';

const Group = (sequelize, DataTypes) => {
    return sequelize.define('Group', {
        // Group ID
        gid: {
            type: DataTypes.UUID,
            allowNull: false
        },
        // Shortcode used for easier access of members
        shortcode: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Time-to-life of groups, defaults to 24 hours
        ttl: {
            type: DataTypes.INTEGER,
            defaultValue: 24
        }
    }, {});
};

module.exports = Group;
