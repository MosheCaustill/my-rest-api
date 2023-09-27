const Joi = require("joi");
const mongoose = require("mongoose");
const _ = require("lodash");

const cardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  subtitle: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
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
  },
  web: {
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
  bizNumber: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 999_999_999,
    unique: true,
  },
  likes: Array({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }),
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Card = mongoose.model("Card", cardSchema, "cards");

function validateCard(card) {
  const schema = Joi.object({
    title: Joi.string().min(2).max(255).required(),
    subtitle: Joi.string().min(2).max(255).required(),
    web: Joi.string().min(11).max(1024).required(),
    description: Joi.string().min(2).max(1024).required(),
    address: Joi.string().min(2).max(400).required(),
    phone: Joi.string()
      .min(9)
      .max(10)
      .required()
      .regex(/^0[2-9]\d{7,8}$/),
    image: Joi.object({
      url: Joi.string().min(11).max(1024),
      alt: Joi.string().min(6).max(255),
    }),
    email: Joi.string().min(6).max(255).required().email(),
    address: Joi.object({
      state: Joi.string().min(0).max(255).allow(""),
      country: Joi.string().min(3).max(255).required(),
      city: Joi.string().min(3).max(255).required(),
      street: Joi.string().min(3).max(255).required(),
      houseNumber: Joi.string().min(1).max(10).required(),
      zip: Joi.string().min(0).max(12),
    }),
  });

  return schema.validate(card);
}

async function generateBizNumber() {
  while (true) {
    const randomNumber = _.random(1000, 999_999_999);
    const card = await Card.findOne({ bizNumber: randomNumber });
    if (!card) {
      return String(randomNumber);
    }
  }
}

module.exports = {
  Card,
  validateCard,
  generateBizNumber,
};
