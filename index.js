'use strict';

const http = require("http");
const app = require("koa")();
const r = require("rethinkdbdash")({host: "rethinkdb-stable"});
const server = http.createServer(app.callback());
const io = require("socket.io")(server);

app.use(require("koa-static")(`${__dirname}/public`));

r.table("todo").changes().then(cursor =>
  cursor.each((err, change) => io.emit("todos:update", change)));

io.on("connect", socket => {
  socket.on("todos", (data, cb) =>
    r.table("todo").then(cb).catch(err => cb(null, err)));

  socket.on("add", (data, cb) =>
    r.table("todo").insert(data)
     .then(cb).catch(err => cb(null, err)));

  socket.on("update", (data, cb) =>
    r.table("todo").get(data.id).update(data)
     .then(cb).catch(err => cb(null, err)));

  socket.on("remove", (data, cb) =>
    r.table("todo").get(data.id).delete()
     .then(cb).catch(err => cb(null, err)));
});

server.listen(8000, () =>
  console.log("Listening on port 8000"));
