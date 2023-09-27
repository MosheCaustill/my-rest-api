const usersData = [
  {
    "name": {
      "first": "regular",
      "last": "user",
    },
    "phone": "0511511511",
    "email": "regularUser@gmail.com",
    "password": "Regular123!",
    "isBusiness": false,
    "isAdmin": false,
    "address": {
      "state": "regular",
      "country": "regular",
      "city": "regular",
      "street": "regular",
      "houseNumber": "11",
    },
  },
  {
    "name": {
      "first": "biz",
      "last": "user",
    },
    "phone": "0511511511",
    "email": "bizUser@gmail.com",
    "password": "Biz12345!",
    "isBusiness": true,
    "isAdmin": false,
    "address": {
      "state": "",
      "country": "bizBiz",
      "city": "bizBiz",
      "street": "bizBiz",
      "houseNumber": "22",
    },
  },
  {
    "name": {
      "first": "admin",
      "last": "user",
    },
    "phone": "0511511511",
    "email": "adminUser@gmail.com",
    "password": "Admin123!",
    "isBusiness": true,
    "isAdmin": true,
    "address": {
      "state": "admin",
      "country": "admin",
      "city": "admin",
      "street": "admin",
      "houseNumber": "33",
    },
  },
];

const cardsData = [
  {
    "title": "Card1 Title",
    "subtitle": "Card1 subTitle",
    "description": "Card1 Description",
    "phone": "0511511511",
    "email": "biz1@biz.com",
    "web": "biz1_web.site",
    "address": {
      "state": "card1",
      "country": "card1",
      "city": "card1",
      "street": "card1",
      "houseNumber": "11",
    },
  },
  {
    "title": "Card2 Title",
    "subtitle": "Card2 subTitle",
    "description": "Card2 Description",
    "phone": "0511511511",
    "email": "biz2@biz.com",
    "web": "biz2_web.site",
    "address": {
      "state": "card2",
      "country": "card2",
      "city": "card2",
      "street": "card2",
      "houseNumber": "22",
    },
  },
  {
    "title": "Card3 Title",
    "subtitle": "Card3 subTitle",
    "description": "Card3 Description",
    "phone": "0511511511",
    "email": "biz3@biz.com",
    "web": "biz3_web.site",
    "address": {
      "state": "card3",
      "country": "card3",
      "city": "card3",
      "street": "card3",
      "houseNumber": "33",
    },
  },
];

module.exports = {
  usersData,
  cardsData,
};
