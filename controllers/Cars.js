import Cars from "../models/CarModel.js";
import jwt from "jsonwebtoken";

export const getAllCars = async(req, res, next) => {
    const cars = await Cars.findAll({
        attributes:['id','nama','harga']
    });

    return res.status(200).json({
        code: 200,
        message: cars
    })
}

export const getCarsById = async(req, res) => {
    const {id} = req.params;
    const cars = await Cars.findOne({
        where:{ id : id},
    });
    return res.status(200).json({
        code: 200,
        message: cars
    })
}

export const getCars = async(req, res, next) => {
    try {
        if(req.role != "admin" && req.role != "superadmin"){
            throw{
                code:400,
                message : "Anda bukan admin atau super admin"
            }
        }
        const cars = await Cars.findAll({
            attributes:['id','nama','harga','creatorId','lastEditorId']
        });
    
        return res.status(200).json({
            code: 200,
            message: cars
        })
    } catch (error) {
        next(error)
    }
    
}

export const createCars = async(req, res, next) => {
    const { nama, harga} = req.body;
    try {
        if(req.role != "admin" && req.role != "superadmin"){
            throw{
                code:400,
                message : "Anda bukan admin atau super admin"
            }
        }

        await Cars.create({
            nama: nama,
            harga: harga,
            creatorId: req.userId,
            lastEditorId: req.userId
        });


        const creatorId = req.userId;
        const creatorName = req.name;

        const data = {
            creatorId,
            creatorName 
        };

        return res.status(200).json({
            code: 200,
            message: "Buku berhasil ditambahkan",
            data: data
        });
    } catch (error) {
        next(error);
    }
}

export const updateCars = async(req, res, next) => {
    const {id} = req.params;
    const { nama, harga} = req.body;
    try {
        if(req.role != "admin" && req.role != "superadmin"){
            throw{
                code:400,
                message : "Anda bukan admin atau super admin"
            }
        }

        await Cars.update({
            nama: nama,
            harga: harga,
            lastEditorId: req.userId
        },
        {
          where:  {id : id},
        });

        const lastEditorId = req.userId;
        const lastEditorName = req.name;

        const data = {
            lastEditorId,
            lastEditorName 
        };

        return res.status(200).json({
            code: 200,
            message: "Buku berhasil diupdate",
            data: data
        });
    } catch (error) {
        next(error);
    }
}

export const deleteCars = async(req, res, next) => {
    try {
        if(req.role != "admin" && req.role != "superadmin"){
            throw{
                code:400,
                message : "Anda bukan admin atau super admin"
            }
        }
        const { id } = req.params;
        const dataBeforeDelete = await Cars.findOne({
            where: { id : id },
        });
        
        const parsedData = JSON.parse(JSON.stringify(dataBeforeDelete));
        if(!parsedData){
            return res.status(400).json({
                success: false,
                message: "Profile doesn't exist or has been deleted!",
            });
        }

        await Cars.destroy({
            where: { id },
        });

        const deleterId = req.userId;
        const deleterBy = req.name;

        const data = {
            deleterId,
            deleterBy 
        };

        return res.status(200).json({
            code: 200,
            message: "Delete Data Successfully",
            data: data
        });

    } catch (error) {
        next(error)
    }


    
}
