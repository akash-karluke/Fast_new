const { createServer } = require("http");
// const express = require('express') (Only if you app uses express)
const next = require("next");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
console.log('its been deployed 29/8/2022 : 08:55');
app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on <http://localhost>:${port}`);
  });
});