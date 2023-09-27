# My-Rest-Api - Server

## Description

This is a server side for managing users and business cards with CRUD options

## Technologies & libraries

1.  "nodeJs": the environment that run the server.
1.  "mongoDB": data base management (local and remote).
1.  "nodemon": for development purposes.
1.  "bcrypt": password encryption.
1.  "chalk": coloring console messages.
1.  "config": configuration.
1.  "cors": cors policy.
1.  "dotenv": environment variables.
1.  "express": requests routing.
1.  "joi": validation.
1.  "jsonwebtoken": managing web tokens.
1.  "lodash": various helper functions.
1.  "mongoose": managing mongoDB.
1.  "morgan": logging response messages.

## Get Started

1. Download the project
1. Make sure you are in the "my-rest-api" folder
1. Install all libraries used needed by running the following command in your terminal

```
npm i
```

4. In the main folder change ".env.example" file to ".env" relevant connection info will be sent directly
1. In order to seed users and cards run the following command in your terminal

```
npm run seeder
```

relevant info will be logged to the terminal

6. Fire up the app by running


then run

```
npm run dev
```

or

```
npm run start
```

for production purpose

## User Model

```
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
```

## Card Model

```
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
```

## Server Usage

### Routes

#### User Route & Methods

| No. | URL          | method | Authorization                | action                   | notice       | return               |
| --- | ------------ | ------ | ---------------------------- | ------------------------ | ------------ | -------------------- |
| 1.  | /users       | POST   | all                          | create new user          | Unique email | User                 |
| 2.  | /users/login | POST   | all                          | login                    |              | Encrypted token      |
| 3.  | /users       | GET    | admin                        | Get all                  |              | Array of users       |
| 4.  | /users/:id   | GET    | The registered user or admin | Get user                 |              | User                 |
| 5.  | /users/:id   | PUT    | The registered user          | Edit user                |              | Edited user          |
| 6.  | /users/:id   | PATCH  | The registered user          | Change isBusiness status |              | User with new status |
| 7.  | /users/:id   | DELETE | The registered user or admin | Delete User              |              | Deleted User         |

### notice

Every request with restricted authorization the token must be sent as an header "x-auth-token"

```
x-auth-token: your token here
```

- minimum data for creating/editing user

```
{
    "name":{
        "first":"fName",
        "last":"lName"
    },
    "phone":"0511511511",
    "email":"email@email.com",
    "password":"Password!123",
    "isBusiness":true,
    "address":{
        "state":"",
        "country":"Israel",
        "city":"bat-yam",
        "street":"street",
        "houseNumber":"10"
    }
}
```

#### Card Route & Methods

| No. | URL                  | method | Authorization                           | action           | return         |
| --- | -------------------- | ------ | --------------------------------------- | ---------------- | -------------- |
| 1.  | /cards               | GET    | all                                     | All cards        | card           |
| 2.  | /cards/my-cards      | GET    | The registered user                     | Get User Cards   | Array of cards |
| 3.  | /cards/:id           | GET    | all                                     | Get card         | card           |
| 4.  | /cards               | POST   | business users                          | create new card  | card           |
| 5.  | /cards/:id           | PUT    | The users who created the card          | Edit card        | card           |
| 6.  | /cards/:id           | PATCH  | A registered user                       | Like card        | card           |
| 7.  | /cards/:id           | DELETE | The users who created the card or admin | Delete card      | Deleted card   |
| 8.  | /cards/changeBiz/:id | PATCH  | admin                                   | change bizNumber | card           |

### notice

Every request with restricted authorization the token must be sent as an header "x-auth-token"

```
x-auth-token: your token here
```

- minimum data for creating/editing card

```
{
    "title":"My Card Title",
    "subtitle":"My Card subTitle",
    "description":"My Card description",
    "phone":"0511511511",
    "email":"email@email.com",
    "web":"myBiz.web",
    "address":{
        "state":"",
        "country":"Israel",
        "city":"Bat-yam",
        "street":"street",
        "houseNumber":"10"
    }
}
```

## HAVE FUN!
