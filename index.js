const server = require("./src/app");

const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log(`port runing in http://localhost:${port}`);
});
