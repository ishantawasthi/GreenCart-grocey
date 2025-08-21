import express from 'express';
import { register ,login, isAuth ,logout} from '../configs/controller/userController.js';
import authUser from '../middlewares/authUser.js';

const userRouter = express.Router();

userRouter.post('/register', register);

userRouter.post('/login', login);

userRouter.post('/isAuth', authUser,isAuth);

userRouter.get('/logout', authUser,logout);


 



export default userRouter;// Exporting the userRouter to be used in server.js