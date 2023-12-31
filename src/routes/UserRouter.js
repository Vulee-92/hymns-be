const express = require("express");
const router = express.Router()
const userController = require('../controllers/UserController');
const { authMiddleWare,authUserMiddleWare } = require("../middleware/authMiddleware");

router.post('/sign-up',userController.createUser)
router.post('/sign-in',userController.loginUser)
router.post('/log-out',userController.logoutUser)
router.put('/update-user/:id',authUserMiddleWare,userController.updateUser)
router.delete('/delete-user/:id',authMiddleWare,userController.deleteUser)
router.get('/getAll',authMiddleWare,userController.getAllUser)
router.get('/get-details/:id',authUserMiddleWare,userController.getDetailsUser)
router.post('/refresh-token',userController.refreshToken)
router.post('/delete-many',authMiddleWare,userController.deleteMany)
router.get('/verify/:id/:verificationCode',userController.verifyUser);

// Thêm route cho quên mật khẩu
router.post('/forgot-password',userController.forgotPassword);

// Thêm route cho reset mật khẩu
router.post('/reset-password/:id/:tokenReset',userController.resetPassword);

module.exports = router