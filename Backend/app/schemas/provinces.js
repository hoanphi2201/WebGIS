module.exports = (sequelize, Sequelize) => {
    const province = sequelize.define(databaseConfig.col_provinces, {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name : {
            type: Sequelize.TEXT,
            allowNull: false,
            defaultValue: ''
        }
    });
    province.associate = function(models) {
        province.hasMany(models.districts, {foreignKey : 'province_id'});
        province.belongsTo(models.province_infos, {foreignKey : 'id', targetKey: 'province_id'});
    };

    return province;
}