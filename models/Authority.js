'use strict';
const Authority = (sequelize, DataTypes) => {
    return sequelize.define('Authority', {
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
        ttl: {
            type: DataTypes.INTEGER,
            defaultValue: 24
        }
    }, {});
};
module.exports = Authority;
//# sourceMappingURL=Authority.js.map