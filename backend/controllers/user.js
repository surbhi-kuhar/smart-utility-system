const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Cookies = require("cookies");

module.exports.createUser = async (req, res, next) => {
  console.log(req.body);
  const { email, password, name, mobilenumber, address } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { mobilenumber: mobilenumber }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({ message: "Email already exists" });
      }
      if (existingUser.mobilenumber === mobilenumber) {
        return res
          .status(409)
          .json({ message: "Mobile number already exists" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
        mobilenumber: mobilenumber,
        address: address,
      },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });

    res.status(201).json({
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
      res.status(200).json({
        found: false,
        message: "Authentication failed",
      });
    }
  } catch (error) {
    console.error("Error logging user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.updateUser = async (req, res, next) => {
  console.log("entered update");
  const id = req.user.id;
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
  const userId = req.user.id;
  console.log("entered delete");

  try {
    // Delete related ratings
    await prisma.rating.deleteMany({
      where: { userId: userId },
    });

    await prisma.booking.deleteMany({
      where: { userId: userId },
    });

    // Now delete the user
    const user = await prisma.user.delete({
      where: { id: userId },
    });

    // Clear the cookie
    const cookies = new Cookies(req, res);
    cookies.set("token", "", { expires: new Date(0) }); // Expire immediately

    res.status(200).json({
      message: "User deleted successfully",
      user: user,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.findUser = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "Invalid user data" });
    }

    const userId = req.user.id;
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    console.log("User data:", user);

    if (user) {
      res.status(200).json({ found: true, user });
    } else {
      res.status(404).json({ found: false });
    }
  } catch (error) {
    console.error("Error fetching user:", error); // Add debugging line
    res.status(500).json({ error: "Server error" });
  }
};
