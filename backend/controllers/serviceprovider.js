const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.createProvider = async (req, res, next) => {
  console.log(req.body);
  const { email, password, name, age, address, service, mobilenumber } =
    req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const serviceProvider = await prisma.serviceProvider.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
        age: age,
        address: address,
        service: service,
        mobilenumber: mobilenumber,
      },
    });

    const token = jwt.sign({ id: serviceProvider.id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });

    res.status(201).json({
      token: token,
      serviceProvider: serviceProvider,
      message: "Service Provider created successfully",
    });
  } catch (error) {
    console.error("Error creating service provider:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.loginProvider = async (req, res, next) => {
  console.log(req.body);
  const { mobilenumber, password } = req.body;

  try {
    const serviceProvider = await prisma.serviceProvider.findFirst({
      where: { mobilenumber: mobilenumber },
    });

    if (serviceProvider) {
      const isPasswordValid = await bcrypt.compare(
        password,
        serviceProvider.password
      );
      if (isPasswordValid) {
        const token = jwt.sign(
          { id: serviceProvider.id },
          process.env.JWT_SECRET,
          {
            expiresIn: "10d",
          }
        );
        return res.status(200).json({
          token: token,
          serviceProvider: serviceProvider,
          message: "Login successful",
        });
      }
    }

    res.status(401).json({ message: "Authentication failed" });
  } catch (error) {
    console.error("Error logging in service provider:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.updateProvider = async (req, res, next) => {
  const serviceProviderId = req.params.id;
  const {
    email,
    password,
    name,
    age,
    address,
    service,
    mobilenumber,
    availabilitystatus,
  } = req.body;
  let hashedPassword;

  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  try {
    const updatedServiceProvider = await prisma.serviceProvider.update({
      where: { id: serviceProviderId },
      data: {
        email: email,
        password: hashedPassword || undefined,
        name: name,
        age: age,
        address: address,
        service: service,
        mobilenumber: mobilenumber,
        availabilitystatus: availabilitystatus,
      },
    });

    res.status(200).json({
      serviceProvider: updatedServiceProvider,
      message: "Service Provider updated successfully",
    });
  } catch (error) {
    console.error("Error updating service provider:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.deleteProvider = async (req, res, next) => {
  const serviceProviderId = req.params.id;

  try {
    const deletedServiceProvider = await prisma.serviceProvider.delete({
      where: { id: serviceProviderId },
    });

    res.status(200).json({
      message: "Service Provider deleted successfully",
      serviceProvider: deletedServiceProvider,
    });
  } catch (error) {
    console.error("Error deleting service provider:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getServiceProviders = async (req, res, next) => {
  const { service } = req.body;

  try {
    const serviceProviders = await prisma.serviceProvider.findMany({
      where: {
        service: service,
      },
      include: {
        ratings: true, // Include the ratings to calculate the average rating
      },
    });

    // Calculate the average rating for each service provider
    const serviceProvidersWithAvgRating = serviceProviders.map((provider) => {
      const totalRatings = provider.ratings.length;
      const sumRatings = provider.ratings.reduce((sum, rating) => sum + rating.rating, 0);
      const avgRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

      return {
        ...provider,
        avgRating,
      };
    });

    // Sort the service providers by their average rating in descending order
    serviceProvidersWithAvgRating.sort((a, b) => b.avgRating - a.avgRating);

    res.status(200).json({
      message: "Service providers found",
      serviceProviders: serviceProvidersWithAvgRating,
    });
  } catch (err) {
    res.status(500).json({
      message: "Unable to find service providers",
      error: err.message,
    });
  }
};

