module.exports = (sequelize, Sequelize) => {
    const province_info = sequelize.define(databaseConfig.col_province_infos, {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        province_id: {
            type: Sequelize.INTEGER,
            references: {
                model: databaseConfig.col_provinces,
                key: "id"
            }
        },
        population: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        area: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        createdAt: {
            field: 'created_at',
            type: Sequelize.DATE,
        },
        updatedAt: {
            field: 'updated_at',
            type: Sequelize.DATE,
        }
    });
    province_info.associate = function(models) {
        province_info.belongsTo(models.provinces, {foreignKey: 'province_id'});
    };
    return province_info;
}