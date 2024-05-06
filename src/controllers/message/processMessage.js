const { messageStatus, processMessageStatus } = require("./messageOption");

const statusProcess = (req, res) => {
  res.send(processMessageStatus());
};

module.exports = { statusProcess };
