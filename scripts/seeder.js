require("dotenv/config");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { User } = require("../models/users");
const { Card, generateBizNumber } = require("../models/cards");
const { usersData, cardsData } = require("./seederData");
const config = require("config");
const chalk = require("chalk");

mongoose
  .connect(config.get("mongoDB.MONGO_URI"))
  .then(() => console.log(chalk.green.bold("connected to db successfully")))
  .then(seed)
  .then(() => mongoose.connection.close())
  .catch((err) => console.log(chalk.red(`could not connect to db: ${err}`)));

async function seed() {
  await User.deleteMany();
  await Card.deleteMany();

  for (let i = 0; i < usersData.length - 1; i++) {
    await seedUser(usersData[i]);
  }

  const user = await seedUser(usersData[usersData.length - 1]);

  for (let j = 0; j < cardsData.length; j++) {
    await createCard({
      ...cardsData[j],
      "user_id": user._id,
    });
  }

  console.log(
    chalk.green(
      "Seeding Completed"
    )
  );
}

async function seedUser(userData) {
  const user = await new User({
    ...userData,
    "password": await bcrypt.hash(userData.password, 12),
  }).save();

  const {email, password, isBusiness,isAdmin} = userData;

  console.log(chalk.blue(`*****New User*****\nemail: ${email},\nUser Password: ${password},\nUser type: Admin: ${isAdmin}, Business: ${isBusiness}`));

  return user;
}
async function createCard(card) {
  const savedCard = await new Card({
    ...card,
    bizNumber: await generateBizNumber(),
  }).save();

  console.log(chalk.blueBright.bold(`*****New Card*****\ncard _id: ${savedCard._id}\ncard user_id:${savedCard.user_id}`));

  return savedCard;
}
