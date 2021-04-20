require("dotenv").config();
const express = require('express');
const logger = require("morgan");
const path = require("path");
const fetch = require('node-fetch');
const axios = require('axios');
// const session = require("express-session");
// const FileStore = require("session-file-store")(session);
const hbs = require('hbs');

const app = express();

app.set("view engine", "hbs");
// Сообщаем express, что шаблона шаблонизаторая (вью) находятся в папке "ПапкаПроекта/views".
app.set("views", path.join(process.env.PWD, "views"));
//hbs.registerPartials(path.join(process.env.PWD, 'views', 'partials'));
// Подключаем middleware, которое позволяет читать переменные JavaScript, сохранённые в формате JSON в body HTTP-запроса.
app.use(express.json());
// Подключаем middleware morgan с режимом логирования "dev", чтобы для каждого HTTP-запроса на сервер в консоль выводилась информация об этом запросе.
app.use(logger("dev"));
// Подключаем middleware, которое сообщает epxress, что в папке "ПапкаПроекта/public" будут находится статические файлы, т.е. файлы доступные для скачивания из других приложений.
app.use(express.static(path.join(process.env.PWD, "public")));
// Подключаем middleware, которое позволяет читать содержимое body из HTTP-запросов типа POST, PUT и DELETE.
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/:id', async (req, res) => {
  const gameId = req.params.id;
  const response1 = await fetch(`https://api.boardgameatlas.com/api/search?ids=${gameId}&client_id=JLBr5npPhV`);
  const game = (await response1.json()).games[0];
  // console.log('game', game);
  const response2 = await fetch(`https://www.boardgameatlas.com/api/game/videos?game_id=${gameId}&client_id=JLBr5npPhV`);
  const video = (await response2.json()).videos[0];
  // console.log('video', video);
  const description = game.description_preview;
  // console.log('description====', description);
  const yandexUrl = 'https://translate.api.cloud.yandex.net/translate/v2/translate';
  const key = process.env.KEY;
  const token = process.env.TOKEN;
  const result = await axios.post(yandexUrl, {
  folder_id: key,
  texts: [description],
  sourceLanguageCode: 'en',
  targetLanguageCode: 'ru',
}, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
}
);
const discriptionRussian = result.data.translations[0].text

  res.render('gamepage', { game, video, discriptionRussian });
})



app.listen(
  process.env.PORT,
  () => {
    console.log("Start!");
  },
);