const config = require("config");

const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    first: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
    },
    middle: {
      type: String,
      minlength: 0,
      maxlength: 255,
      default: "",
    },
    last: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
    },
    _id: {
      type: mongoose.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
  },
  phone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 10,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  image: {
    url: {
      type: String,
      minlength: 11,
      maxlength: 1024,
      deafult:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    alt: {
      type: String,
      minlength: 6,
      maxlength: 255,
      deafult: "user image",
    },
    _id: {
      type: mongoose.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
  },
  address: {
    state: {
      type: String,
      minlength: 0,
      maxlength: 255,
      default: "",
    },
    country: {
      type: String,
      minlength: 3,
      maxlength: 255,
      required: true,
    },
    city: {
      type: String,
      minlength: 3,
      maxlength: 255,
      required: true,
    },
    street: {
      type: String,
      minlength: 3,
      maxlength: 255,
      required: true,
    },
    houseNumber: {
      type: String,
      minlength: 1,
      maxlength: 10,
      required: true,
    },
    zip: {
      type: String,
      minlength: 6,
      maxlength: 255,
    },
    _id: {
      type: mongoose.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
  },
  isBusiness: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    default: false,
    type: Boolean,
  },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, isBusiness: this.isBusiness, isAdmin: this.isAdmin },
    config.get("secret.JWT_SECRET")
  );
};

const User = mongoose.model("User", userSchema, "users");

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.object({
      first: Joi.string().min(2).max(255).required(),
      middle: Joi.string().min(0).max(255),
      last: Joi.string().min(2).max(255).required(),
    }).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
    isBusiness: Joi.boolean().required(),
    phone: Joi.string()
      .min(9)
      .max(10)
      .required()
      .regex(/^0[2-9]\d{7,8}$/),
    image: Joi.object({
      url: Joi.string().min(11).max(1024),
      alt: Joi.string().min(6).max(255),
    }),
    address: Joi.object({
      state: Joi.string().min(0).max(255).allow(""),
      country: Joi.string().min(6).max(255).required(),
      city: Joi.string().min(6).max(255).required(),
      street: Joi.string().min(2).max(255).required(),
      houseNumber: Joi.string().min(1).max(10).required(),
      zip: Joi.string().min(0).max(12),
    }),
  });

  return schema.validate(user);
}

module.exports = { User, validateUser };
