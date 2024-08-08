const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.rate = async (req, res, next) => {
  try {
    const { serviceProviderId, rating, review } = req.body;
    const userId = req.user.id; // Assuming you have user information in the request

    // Check if the user has already rated this service provider
    const existingRating = await prisma.rating.findFirst({
      where: {
        userId: userId,
        serviceProviderId: serviceProviderId,
      },
    });

    if (existingRating) {
      return res
        .status(400)
        .json({ error: "You have already rated this service provider." });
    }

    // Create a new rating
    const newRating = await prisma.rating.create({
      data: {
        userId: userId,
        serviceProviderId: serviceProviderId,
        rating: rating,
        review: review,
      },
    });

    res
      .status(201)
      .json({ message: "Rating created successfully.", rating: newRating });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the rating." });
  }
};

module.exports.updateRating = async (req, res, next) => {
  try {
    const { ratingId, rating, review } = req.body;
    const userId = req.user.id; // Assuming you have user information in the request

    // Check if the rating exists and belongs to the user
    const existingRating = await prisma.rating.findUnique({
      where: {
        id: ratingId,
      },
    });

    if (!existingRating || existingRating.userId !== userId) {
      return res
        .status(404)
        .json({
          error: "Rating not found or you are not authorized to update it.",
        });
    }

    // Update the rating
    const updatedRating = await prisma.rating.update({
      where: { id: ratingId },
      data: {
        rating: rating,
        review: review,
      },
    });

    res
      .status(200)
      .json({ message: "Rating updated successfully.", rating: updatedRating });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the rating." });
  }
};
