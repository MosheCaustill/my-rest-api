const router = require("express").Router();

const Joi = require("joi");
const bcrypt = require("bcrypt");
// const _ = require("lodash");

const { User, validateUser } = require("../models/users");
const authMW = require("../middleware/authMW");

//register user//
router.post("/", async (req, res) => {
  //validate users input//
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).json(error.details[0].message);
    return;
  }
  //validate system//
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(400).send("User already registered");
    return;
  }
  //process//
  user = new User(req.body);
  user.password = await bcrypt.hash(user.password, 12);

  await user.save();
  //results//
  res.json(user);
});
/////////login/////////////
router.post("/login", async (req, res) => {
  //validate input//
  const { error } = validateAuthInput(req.body);
  if (error) {
    res.status(400).json(error.details[0].message);
    return;
  }
  //validate system//
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send("wrong password or email");
    return;
  }
  const passwordMatch = await bcrypt.compare(req.body.password, user.password);
  if (!passwordMatch) {
    res.status(400).send("wrong password or email");
    return;
  }
  //process//
  const token = user.generateAuthToken();
  //response//
  res.send({ token });
});
////////admin get all users//////////
router.get("/", authMW("isAdmin"), async (req, res) => {
  try {
    const allUsers = await User.find();
    res.send(allUsers);
  } catch (err) {
    res.send(err.message);
  }
});
///////////admin / user own info////get a user info////by id///
router.get("/:id", authMW("isAdmin", "userOwner"), async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select(
      "-password -__v"
    );
    res.json(user);
  } catch (err) {
    res.statusMessage = "User was not found.";
    res.status(401).send("User was not found.");
  }
});

//Edit user
router.put("/:id", authMW("userOwner"), async (req, res) => {
  //validate user input
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).json(error.details[0].message);
    return;
  }
  //validate system//
  let user = await User.findOne({
    email: req.body.email,
    _id: { $ne: req.user._id },
  });
  if (user) {
    res.status(401).send("Invalid email address");
    return;
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { ...req.body },
      { new: true }
    );
    res.send(user);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

///change isBusiness status///
router.patch("/:id", authMW("userOwner"), async (req, res) => {
  if (
    !Object.keys(req.body).includes("isBusiness") ||
    typeof req.body.isBusiness != "boolean"
  ) {
    res.status(401).send("is business must be included and type of boolean");
    return;
  }
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { isBusiness: req.body.isBusiness },{new:true}
    );
    res.send(user);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

///delete user
router.delete("/:id", authMW("isAdmin", "userOwner"), async (req, res) => {
  try {
    const user = await User.findOneAndRemove({ _id: req.params.id });
    res.send(user);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

function validateAuthInput(user) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(2).max(1024).required(),
  });

  return schema.validate(user);
}
module.exports = router;
