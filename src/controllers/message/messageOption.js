let sendMessage = true;

function messageOp(op) {
  sendMessage = op;
}
function messageStatus() {
  return sendMessage;
}

let processMessage = false;

function processMessageOp(op) {
  processMessage = op;
}
function processMessageStatus() {
  return processMessage;
}

module.exports = {
  messageOp,
  messageStatus,
  processMessageOp,
  processMessageStatus,
};
