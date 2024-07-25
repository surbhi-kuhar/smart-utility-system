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

module.exports.updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { email, password, name, mobilenumber, address } = req.body;

  try {
    // Find the user by ID
    const user = await prisma.user.findUnique({
      where: { id: id }, // Assuming id is an integer. Adjust if it's a different type.
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update the user details
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        email: email || user.email,
        password: password ? await bcrypt.hash(password, 10) : user.password,
        name: name || user.name,
        mobilenumber: mobilenumber || user.mobilenumber,
        address: address || user.address,
      },
    });

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.deleteUser = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await prisma.user.delete({
      where: { id: userId },
    });
    res.status(200).json({
      message: "User deleted successfully",
      user: user,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
