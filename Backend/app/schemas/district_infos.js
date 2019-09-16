module.exports = (sequelize, Sequelize) => {
    const district_info = sequelize.define(databaseConfig.col_district_infos, {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        district_id: {
            type: Sequelize.INTEGER,
            references: {
                model: databaseConfig.col_districts,
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
    district_info.associate = function(models) {
        district_info.belongsTo(models.districts, {foreignKey: 'district_id'});
    };
    return district_info;
}