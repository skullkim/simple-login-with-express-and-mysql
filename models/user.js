const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            name: {
                type: Sequelize.STRING(20),
                allowNULL: false,
                unique: true,
            },
            passwd: {
                type: Sequelize.STRING(20),
                allowNULL: false,
            },
            // created_at: {
            //     type: Sequelize.DATE,
            //     allowNULL: true,
            //     defaultValue: Sequelize.NOW,
            // }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'User',
            tableName: 'users',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    //static associate(db) {}
};