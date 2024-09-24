module.exports.convo = async (req, res, next) => {
  const { bookingId, userId, serviceProviderId } = req.body;
  console.log(bookingId);
  console.log(userId);
  console.log(serviceProviderId);

  try {
    const conversation = await prisma.conversation.create({
      data: {
        bookingId,
        userId,
        serviceProviderId,
      },
    });
    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ error: "Failed to create conversation" });
  }
};
