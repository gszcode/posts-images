const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { 
    renderRegister, 
    formRegister,
    tokenConfirm,
    renderLogin,
    formLogin,
    logout
} = require('../controllers/users');

// register
router.get('/register', renderRegister);
router.post('/register', [
    body('user', 'Please enter a valid username')
        .trim()
        .notEmpty()
        .escape(),
    body('email', 'Invalid email')
        .trim()
        .isEmail()
        .normalizeEmail(),
    body('password', 'Invalid password, min 6 characters')
        .trim()
        .isLength({min: 6})
        .escape()
        .custom((value, {req}) => {
            if(value !== req.body.repassword){
                throw new Error('Passwords do not match');
            } else {
                return value;
            }
        })
], formRegister);

// token
router.get('/confirm/:token', tokenConfirm);

// login
router.get('/login', renderLogin);
router.post('/login', [
    body('email', 'Invalid email')
        .trim()
        .isEmail()
        .normalizeEmail(),
    body('password', 'Invalid password')
        .trim()
        .isLength({min: 6})
        .escape()
], formLogin);

// logout
router.get('/logout', logout);

module.exports = router;