const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.convo = async (req, res, next) => {
  const { bookingId, userId, serviceProviderId } = req.body;

  try {
    let conversation = await prisma.conversation.findFirst({
      where: {
        bookingId,
        userId,
        serviceProviderId
      },
    });

    // If no existing conversation, create a new one
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          bookingId,
          userId,
          serviceProviderId,
        },
      });
    }

    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ error: "Failed to create or find conversation" });
  }
};

// Fetch previous messages
module.exports.getMessages = async (req, res, next) => {
  const { conversationId } = req.params;
  console.log("#################################",conversationId);

  try {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" }, // Sort by oldest messages first
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

module.exports.storeMessage = async (req, res, next) => {
  const { conversationId, senderId, content } = req.body;
  console.log("senderId is", senderId);

  try {
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
      },
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};
