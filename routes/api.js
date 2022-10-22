import express from 'express'
import multer from 'multer'
import UserController from '../controllers/UserController.js' 
import AuthController from '../controllers/AuthController.js' 
import authCheck from '../controllers/middlewares/auth_middleware.js'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix =  Date.now() + file.originalname
      cb(null, uniqueSuffix)
    }
  })
  const upload = multer({ storage: storage })

const router = express.Router();
//Auth routes
router.post('/register',AuthController.register)
router.post('/login',AuthController.login)
router.get('/logout',AuthController.logout)
router.get('/users', authCheck,UserController.getUser)
router.post('/user/add',authCheck,UserController.addUser)
router.get('/user/edit/:id',UserController.editUser)
router.put('/user/update',UserController.updateUser)
router.get('/user/delete/:id',UserController.deleteUser)
router.post('/upload',upload.single('image'),UserController.uploadPic)

export default router