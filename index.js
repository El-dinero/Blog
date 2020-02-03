const app = require("./app");
const database = require("./database");
const config = require("./config");

database().then(info => {
  console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
  //PORT listen 5000;
  app.listen(config.PORT, () => {
    console.log(`Server started on port${config.PORT}`);
  });
}).catch(() => {
  console.error('Unable to connect to database');
  process.exit(1);
});


