module.exports = (sequelize, Sequelize) => {
    const province_geo = sequelize.define(databaseConfig.col_province_geos, {
        province_id: {
            type: Sequelize.INTEGER,
            references: {
                model: databaseConfig.col_provinces,
                key: "id"
            }
        },
        json: {
            type: Sequelize.JSON,
            allowNull: false
        },
        center: {
            type: Sequelize.JSON,
            allowNull: false
        }
    });
    province_geo.associate = models => {
        province_geo.belongsTo(models.provinces, { foreignKey: "province_id" });
    };
    return province_geo;
}