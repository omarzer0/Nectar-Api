const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { registerValidation, loginValidation } = require("../validation");

// registration
// /api/user/register
router.post("/register", async (req, res) => {
  // validate
  const { error } = registerValidation(req.body);
  if (error)
    return res
      .status(400)
      .json({ error: error.details[0].message.replace(/"/g, "") });

  // check if email exist before
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).json({ error: "Email already exists" });

  //   // hash the password
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(req.body.password, salt);

  // create the user
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: encryptedPassword,
  });

  try {
    const savedUser = await newUser.save();
    return res.json({ error: null, data: savedUser._id });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// login
// /api/user/login
router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error)
    return res
      .status(400)
      .json({ error: error.details[0].message.replace(/"/g, "") });

  const validUser = await User.findOne({ email: req.body.email });
  if (!validUser)
    return res.status(400).json({ error: "Wrong email or password" });

  const validPassword = await bcrypt.compare(
    req.body.password,
    validUser.password
  );
  if (!validPassword)
    return res.status(400).json({ error: "Wrong email or password" });

  const token = jwt.sign(
    {
      name: validUser.name,
      id: validUser._id,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  // attach to header
  res.header("auth-token", token).json({ eror: null, data: { token } });
});

module.exports = router;
