import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
 
export const getUsers = async(req, res, next) => {
    try {
        if(req.role != "superadmin"){
            throw{
                code:400,
                message : "Anda bukan super admin"
            }
        }

        const users = await Users.findAll({
            attributes:['id','name','email','role']
        });
        res.json(users);
    } catch (error) {
        next(error);
    }
}
 
export const Register = async(req, res) => {
    const { name, email, password, confPassword, role } = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        });
        res.json({msg: "Register Berhasil"});
    } catch (error) {
        console.log(error);
    }
}
 
export const Login = async(req, res) => {
    try {
        const user = await Users.findAll({
            where:{
                email: req.body.email
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({msg: "Wrong Password"});
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const role = user[0].role;
        const accessToken = jwt.sign({userId, name, email,role}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        const refreshToken = jwt.sign({userId, name, email,role}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '183d'
        });
        await Users.update({refresh_token: refreshToken},{
            where:{
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        
        const data = {
            userId,
            email,
            role,
            accessToken,
            refreshToken,
        };
        
        return res.status(201).json({
            success: true,
            message: "Login Succesfully",
            data: data,
        })

    } catch (error) {
        res.status(404).json({msg:"Email tidak ditemukan"});
    }
}
 
export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({refresh_token: null},{
        where:{
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}

export const whoAmI = async(req, res, next) => {
    try {
        const userId = req.userId;
        const userName = req.name;
        const email = req.email;

        const data = {
            userId,
            userName,
            email 
        };

        return res.status(200).json({
            code: 200,
            data: data
        });
    } catch (error) {
        next(error);
    }
}