const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
//Insert Model
const User = require('../Model/UserModel');
//Insert Controller
const UserController = require('../Controllers/UserControllers');

router.get('/', UserController.getAllUsers);
router.post('/', UserController.addUser);
router.post('/login', UserController.loginUser);
router.get('/session', authMiddleware, UserController.getSessionUser);
router.get('/:id', UserController.getById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);
//exports
module.exports = router;