const express = require('express');
const router = express.Router();

const { token } = require('morgan');

//import middlware 
const checkAuth = require('../middleware/check-auth');
//import controllers
const userController = require('../controllers/users')


router.post('/signup', userController.user_Signup);

router.post('/login', userController.user_Login);

router.delete('/:userId', checkAuth, userController.user_Delete)

module.exports = router;