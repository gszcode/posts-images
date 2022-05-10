const User = require('../models/User');
const { nanoid } = require('nanoid');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
require('dotenv').config();

// register
const renderRegister = (req, res) => {
    return res.render('log/register', { messages: req.flash('messages') });
}

const formRegister = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.flash('messages', errors.array());
        return res.redirect('/users/register');
    }

    const { user, email, password } =  req.body;
    try {
        let userModel = await User.findOne({ email });
        if(userModel) throw new Error('The email exists');

        userModel = new User({ user, email, password, tokenConfirm: nanoid() });
        await userModel.save();

        //send email
        const transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.USEREMAIL,
                pass: process.env.PASSEMAIL
            }
        });

        await transport.sendMail({
            from: '"Fred Foo 👻"<foo@example.com>',
            to: userModel.email,
            subject: 'Check your email account',
            html: `<a href="${process.env.PATHHEROKU || 'http:localhost:4000'}/users/confirm/${userModel.tokenConfirm}">Check your account here</a>`
        });

        req.flash('messages', [{msg: 'Check your email to confirm the account'}]);
        return res.redirect('/users/login');
    } catch (error) {
        req.flash('messages', [{msg: error.message}]);
        return res.redirect('/users/register');
    }
}

// token
const tokenConfirm = async (req, res) => {
    const { token } = req.params;

    try {
        const idToken = await User.findOne({ tokenConfirm: token });
        if(!idToken) throw new Error('User does not exist');
        
        idToken.tokenConfirm = null;
        idToken.accountConfirm = true;

        await idToken.save();

        req.flash('messages', [{msg: 'Confirmed account, you can login'}]);
        return res.redirect('/users/login');
    } catch (error) {
        console.log(error);
        return res.json({Error: error.message});
    }
}

// login
const renderLogin = (req, res) => {
    return res.render('log/login', { messages: req.flash('messages') });
}

const formLogin = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.flash('messages', errors.array());
        return res.redirect('/users/register');
    }

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        
        if(!user) throw new Error('Invalid email');
        if(!user.accountConfirm) throw new Error('You need to confirm the account');
        if(!(await user.comparePassword(password))) throw new Error('Invalid password');

        //login passport
        req.login(user, function(err){
            if(err) throw new Error('Error');
            return res.redirect('/');
        });
        
    } catch (error) {
        req.flash('messages', [{msg: error.message}]);
        return res.redirect('/users/login');
    }
}

// logout
const logout = (req, res) => {
    req.logout();
    return res.redirect('/users/login');
}

module.exports = {
    renderRegister,
    formRegister,
    tokenConfirm,
    renderLogin,
    formLogin,
    logout
}