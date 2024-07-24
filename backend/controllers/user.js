const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.createUser = async (req, res, next) => {
  console.log(req.body);
  const { email, password, name, mobilenumber, address } = req.body;

  try {
    const userAlready = await prisma.user.findFirst({
      where: {
        mobilenumber: mobilenumber,
      },
    });

    if (userAlready) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedpassword", hashedPassword);
    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
        mobilenumber: mobilenumber,
        address: address,
      },
    });
    console.log(user);
    console.log(user.id);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });

    res.status(200).json({
      token: token,
      user: user,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.loginUser = async (req, res, next) => {
  console.log(req.body);
  const { mobilenumber, password } = req.body;

  try {
    const userAlready = await prisma.user.findFirst({
      where: {
        mobilenumber: mobilenumber,
      },
    });

    if (userAlready) {
      const pass = await bcrypt.compare(password, userAlready.password);
      if (pass) {
        // Generate a JWT if the password matches
        const token = jwt.sign({ id: userAlready.id }, process.env.JWT_SECRET, {
          expiresIn: "10d",
        });
        return res.status(200).json({
          token: token,
          user: userAlready,
          message: "Login successful",
        });
      }
    } else {
      res.status(404).json({
        message: "Authentication failed",
      });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
