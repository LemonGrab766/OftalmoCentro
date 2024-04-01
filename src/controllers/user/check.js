const jwt = require("jsonwebtoken");

const check = async (req, res) => {
  try {
    const { ID, EMAIL, SECRET_KEY } = process.env;
    const token = req.headers.token;

    const isTokenValid = jwt.verify(token, SECRET_KEY);

    if (isTokenValid.id !== ID || isTokenValid.email !== EMAIL) {
      return res.status(400).json({ message: "Los datos no son correctos" });
    }
    return res.status(200).json({ message: "El usuario es correcto" });
  } catch (error) {
    res.status(500).json({ message: "Ha ocurrido un error", error });
  }
};

module.exports = { check };
