const { messageOp, messageStatus } = require("./messageOption");

const cancelMessage = (req, res) => {
    console.log("hola");
  messageOp(false);
  res.send(true)
};

const statusMessage = (req, res) => {
    if (messageStatus()) {
      res.send(true);
    } else {
      res.send(false);
    }
  };

module.exports = { cancelMessage, statusMessage };
