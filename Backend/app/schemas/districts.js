module.exports = (sequelize, Sequelize) => {
    const district = sequelize.define(databaseConfig.col_districts, {
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
    district.associate = function(models) {
        district.hasMany(models.districts, {foreignKey : 'district_id'});
        district.belongsTo(models.district_infos, {foreignKey : 'id', targetKey: 'district_id'});
    };
    return district;
}