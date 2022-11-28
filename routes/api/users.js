const express = require("express");
const User = express.Router();
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar")
// @route POST api/users
// @desc Register user
//  @access Public
User.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more charachters"
    ).isLength({ min: 6 }),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
      const { name, email, password } = req.body;
      try {
          let user = await User.findOne({ email });
          if (user) {
              res.status(400).json({errors:[{msg:"user already exit"}]})
          }
          const avatar = gravatar.url(email, {
              s: "200",
              r: "pg",
              d:"mm"
          })
          const = new User({
              name,
              email,
              avatar,
              password
          })
          const salt = await bcrypt.genSalt(10) 

          user.password = await bcrypt.hash(password, salt)
          
          await user.save();
           res.send("User Registered");
      } catch (err) {
          console.error(err.message)
          res.status(500).send('server')
      }
    // see user exist
    // get User avatar
    //   encript password
    //   return json webtoken

   
  }
);

User.get("/", (req, res) => {
  res.status(200).json({
    message: "user route",
  });
});
module.exports = User;
