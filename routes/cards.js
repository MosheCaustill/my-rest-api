const router = require("express").Router();

const { Card, validateCard, generateBizNumber } = require("../models/cards");

const authMW = require("../middleware/authMW");

//all cards//
router.get("/", async (req, res) => {
  try {
    const cards = await Card.find();
    res.send(cards);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

//my cards//
router.get("/my-cards", authMW(), async (req, res) => {
  try {
    const cards = await Card.find({ user_id: req.user._id });
    res.send(cards);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

//card by id//
router.get("/:id", async (req, res) => {
  try {
    const card = await Card.findOne({ _id: req.params.id });
    res.send(card ? card : "no matching card found");
  } catch (err) {
    res.status(401).send(err.message);
  }
});

//create card//

router.post("/", authMW("isBusiness"), async (req, res) => {
  //validate card input//
  const { error } = validateCard(req.body);

  if (error) {
    res.status(400).json(error.details[0].message);
    return;
  }

  //process//
  let card = new Card(req.body);
  card.user_id = req.user._id;
  card.bizNumber = String(generateBizNumber());
  try {
    await card.save();

    //results//
    res.json(card);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

//edit card///

router.put("/:id", authMW("cardOwner"), async (req, res) => {
  //validate card input//
  const { error } = validateCard(req.body);
  if (error) {
    res.status(400).json(error.details[0].message);
    return;
  }
  //process//
  try {
    const card = await Card.findOneAndUpdate(
      { _id: req.params.id },
      { ...req.body },
      { new: true }
    );

    //results//
    res.json(card);
  } catch (err) {
    res.status(401).send(err.message);
  }
});
///like card///
router.patch("/:id", authMW(), async (req, res) => {
  try {
    const foundCard = await Card.findOne({
      _id: req.params.id,
      "likes.user_id": req.user._id,
    });
    if (foundCard) {
      res.statusMessage = "You already liked this card.";
      res.status(400).send("You already liked this card.");
      return;
    }
    if (foundCard == null) {
      res.statusMessage = "no matching card found";
      res.status(400).send("no matching card found");
      return;
    }
    const card = await Card.findOneAndUpdate(
      { _id: req.params.id },
      { "$push": { likes: { user_id: req.user._id } } },
      { new: true }
    );
    res.json(card);
  } catch (err) {
    res.status(400).send(err.message);
  }
});
///delete card///
router.delete("/:id", authMW("isAdmin", "cardOwner"), async (req, res) => {
  try {
    const card = await Card.findOneAndRemove({ _id: req.params.id });
    res.send(card ? card : "no card where found");
  } catch (err) {
    res.status(401).send(err.message);
  }
});

//Change BizNumber
router.patch("/changeBizNumber/:id", authMW("isAdmin"), async (req, res) => {
  if (isNaN(req.body.bizNumber) && req.body.bizNumber !== undefined) {
    res.status(400).send("bizNumber must be a number");
    return;
  }
  if (req.body.bizNumber) {
    try {
      const card = await Card.findOne({
        bizNumber: req.body.bizNumber,
        _id: { $ne: req.params.id },
      });
      if (card) {
        res.status(401).send("A card with this bizNumber already exists.");
        return;
      }
    } catch (err) {
      res.status(401).send(err.message);
    }
  }
  try {
    const card = await Card.findOneAndUpdate(
      { _id: req.params.id },
      { bizNumber: req.body.bizNumber || (await generateBizNumber()) },
      { new: true }
    );
    res.send(card ? card : "invalid card id");
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
