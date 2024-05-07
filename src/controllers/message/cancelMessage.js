const { messageOp, messageStatus, processMessageOp } = require("./messageOption");

const cancelMessage = (req, res) => {
  processMessageOp(false);
  messageOp(false);
  res.send(true);
};

const statusMessage = (req, res) => {
  if (messageStatus()) {
    res.send(true);
  } else {
    res.send(false);
  }
};

module.exports = { cancelMessage, statusMessage };
