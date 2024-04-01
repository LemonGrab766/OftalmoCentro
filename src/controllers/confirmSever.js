const confirmServer = (req, res) => {
  console.log("confirmar sever");
  res.send("ok");
};

module.exports = { confirmServer };
