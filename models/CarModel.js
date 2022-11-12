import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Cars = db.define('cars',{
    nama:{
        type: DataTypes.STRING 
    },
    harga:{
        type: DataTypes.STRING
    },
    creatorId:{
        type: DataTypes.NUMBER
    },
    lastEditorId:{
        type: DataTypes.NUMBER
    }
},{
    freezeTableName:true,
    timestamps: false
});

(async() => {
    await db.sync();
})();

export default Cars;