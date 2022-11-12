import express from "express";
import { getUsers, Register, Login, Logout, whoAmI} from "../controllers/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import {getAllCars, getCars, getCarsById, createCars, updateCars, deleteCars} from "../controllers/Cars.js"
 
const router = express.Router();
const prefix = "/v1/api/";
 
// users
router.post(prefix + 'register', Register);
router.post(prefix + 'login', Login);
router.delete(prefix + 'logout', Logout);
router.get(prefix + 'user', verifyToken, whoAmI);
router.get(prefix + 'token', refreshToken);
router.get(prefix + 'users', verifyToken, getUsers);



// cars 
router.get(prefix + 'car', getAllCars)
router.get(prefix + 'cars', verifyToken, getCars);
router.get(prefix + 'cars/:id', getCarsById);
router.post(prefix + 'cars', verifyToken, createCars);
router.put(prefix + 'cars/:id', verifyToken, updateCars);
router.delete(prefix + 'cars/:id', verifyToken, deleteCars);


export default router;