'use strict';

const Authority = (sequelize, DataTypes) => {
    return sequelize.define('Authority', {
        // Group ID
        aid: {
            type: DataTypes.UUID,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING
        },
        auth: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDv4
        },
        // Time-to-life of groups, defaults to 24 hours
        ttl: {
            type: DataTypes.INTEGER,
            defaultValue: 24
        }
    }, {});
};

module.exports = Authority;
