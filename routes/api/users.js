const express = require('express');
const User  = express.Router();
const {check, validationResult} = require('express-validator/check');

// @route POST api/users
// @desc Test rout
//  @access Public
User.post(
    '/',
//     [
//     check('name','Name is required').not().isEmpty(),
//     check('email','Please include a valid email').isEmail(),
//     check('password','Please enter a password with 6 or more charachters').isLength({min:6})
// ],
(req,res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty() ){
        return res.status(400).json({errors:errors.array()});
    }
    console.log(req.body);
    res.send('User route');
});


User.get('/' , (req, res) => {
    res.status(200).json({
message: "test"
    })
})
module.exports = User;
 