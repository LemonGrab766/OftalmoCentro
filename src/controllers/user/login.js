const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { ID, EMAIL, PASSWORD, SECRET_KEY } = process.env;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Faltan campos por llenar" });
    }

    if (email !== EMAIL || password !== PASSWORD) {
      return res.status(400).json({ message: "Los datos no son correctos" });
    }

    const user = { id: ID, email };
    const token = jwt.sign(user, SECRET_KEY, {
      expiresIn: 2592000,
    });

    res.cookie("auth_cookie", token, {
      // httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:"strict",
      maxAge: 2592000 * 1000,
      path: "/",
    });

    return res.status(200).json({ message: "Se inició sesión" });
  } catch (error) {
    res.status(500).json({ message: "Ha ocurrido un error", error });
  }
};

module.exports = { login };
