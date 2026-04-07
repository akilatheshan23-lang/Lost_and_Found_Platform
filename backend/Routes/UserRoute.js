const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
//Insert Model
const User = require('../Model/UserModel');
//Insert Controller
const UserController = require('../Controllers/UserControllers');

router.get('/', UserController.getAllUsers);
router.post('/', UserController.addUser);
router.post('/forgot', UserController.forgotPassword);
router.post('/reset', UserController.resetPassword);
router.post('/login', UserController.loginUser);
router.get('/session', authMiddleware, UserController.getSessionUser);
router.post('/mfa/generate', authMiddleware, UserController.generateMfa);
router.post('/mfa/verify', authMiddleware, UserController.verifyMfa);
router.post('/mfa/disable', authMiddleware, UserController.disableMfa);
router.get('/:id', UserController.getById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);
//exports
module.exports = router;