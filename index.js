const express = require('express');
const prikoli = require('./prikols');
const database = require('./database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const middleware = require('./middleware');
const creatingTokens = require('./creatingTokens');
const { getUserByLoginFromDB } = require("./database");
const { checkToken } = require("./middleware");
const app = express();
const port = 3000;

app.use(express.static(__dirname));


app.get('/', (req, res) => res.sendFile(__dirname + "/index.html"));


app.post('/register',
  express.json(),
  async function(req, res) {
    let isUser;
    try {
      isUser = await database.getUserByLoginFromDB(req.body.userName);

      if (isUser) {
        res.status(409).json({message: "Такой пользователь уже существует!"});
      } else {
        let hashedPassword = await bcrypt.hash(req.body.password, 8);
        await database.addUserToDB(req.body.userName, hashedPassword);
        //console.log('добавлено!')

        let tokens = creatingTokens.createTokens(req.body.userName, hashedPassword);

        res.status(200).json({
          accessToken: tokens[0],
          refreshToken: tokens[1]
        });
      }
    } catch (err) {
      return res.status(400).json({message: "Что-то пошло не так..."});
    }
  });

app.post('/login',
  express.json(),
  async function(req, res) {
    try {
      let isUser = await database.getUserByLoginFromDB(req.body.userName);
      if (!isUser) {
        return res.status(404).json({message: "Такого пользователя не существует!"});
      }

      if (!await bcrypt.compare(req.body.password, isUser)) {
        return res.status(409).json({message: "Неверный пароль!"});
      }

      let tokens = creatingTokens.createTokens(req.body.userName, isUser);

      res.status(200).json({
        accessToken: tokens[0],
        refreshToken: tokens[1]
      });
    } catch (err) {
      res.status(400).json({message: "Что-то пошло не так..."});
    }
  });


app.post('/feedback',
  express.json(),
  /*middleware.checkToken,*/
  async function(req, res) {
    let feedback = await database.setFeedbackToDB(req.body.picName, req.body.vote);
    res.status(200).send(feedback);
  });


app.get('/getPrikol', async (req, res) => {
  let badLink = await prikoli.getRandomPrikol();
  let link = '/prikoli/' + badLink;
  let feedback = await database.getFeedbackOfDB(link);
  res.status(200).send([link, feedback[0], feedback[1]]);
});

app.post('/getaccesstoken', express.json(), async (req, res) => {
  try {
    let oldRefreshToken = req.body.refreshToken;
    let decodedOldRefreshToken = jwt.decode(oldRefreshToken, 'secret-jwt-key');
    let userPassword = getUserByLoginFromDB(decodedOldRefreshToken.userName);
    if (userPassword == decodedOldRefreshToken.password && decodedOldRefreshToken.token_type == 'refresh') {
      let newTokens = creatingTokens.createTokens(decodedOldRefreshToken.userName, userPassword);
      res.status(200).json({
        accessToken: newTokens[0],
        refreshToken: newTokens[1]
      });
    } else {
      res.status(401).json({message: "Неправильный пароль!"});
    }

  } catch (err) {
    console.log(err);
    res.status(401).json({message: "Invalid token!"});
  }
});

app.post('/checktoken', express.json(), checkToken,
  async function(req, res) {
    res.status(200).json({message: "Norm token"});
  });


app.listen(port, () => console.log(`Example app listening on port ${port}!`));