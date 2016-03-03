'use strict';

const app = require("koa")();
const server = app.listen(8000);
const horizon = require("@horizon/server")(server, {
  rdb_host: "rethinkdb-stable",
  auto_create_table: true,
  auto_create_index: true
});

app.use(require("koa-static")(`${__dirname}/public`));
