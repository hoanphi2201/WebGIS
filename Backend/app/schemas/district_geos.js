module.exports = (sequelize, Sequelize) => {
    const district_geo = sequelize.define(databaseConfig.col_district_geos, {
        district_id: {
            type: Sequelize.INTEGER,
            references: {
                model: databaseConfig.col_districts,
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
    district_geo.associate = models => {
        district_geo.belongsTo(models.districts, { foreignKey: "district_id" });
    };
    return district_geo;
}