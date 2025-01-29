const cron = require('node-cron');
const amqp = require('amqplib');
const { subDays, startOfDay, endOfDay } = require('date-fns');
const ConnectionRequestModel = require('../model/connectionRequest'); // Adjust path based on your project
const{startEmailWorker} =require("./DQueue")

async function enqueueEmails() {
  const yesterday = subDays(new Date(), 0);
  const yesterdayStart = startOfDay(yesterday);
  const yesterdayEnd = endOfDay(yesterday);

  try {
    // Find "interested" connection requests from yesterday
    const pendingInterest = await ConnectionRequestModel.find({
      status: 'interested',
      createdAt: {
        $gte: yesterdayStart,
        $lte: yesterdayEnd,
      },
    }).populate('senderId receiverId');

    // Extract unique email IDs from the pending connection requests
    const listOfemailId = [...new Set(pendingInterest.map(req => req.receiverId.emailId))];
    console.log("LIST",listOfemailId);
    

    // Connect to RabbitMQ
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'emailQueue'; // Name of the queue

    // Ensure the queue exists
    await channel.assertQueue(queue, { durable: true });

    // Enqueue each email for sending
    listOfemailId.forEach(email => {
      const message = JSON.stringify({
        receiverEmail: email,
        status: 'dailyMail'
      });

      // Send message to the queue
      channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
    });

    console.log('Emails enqueued successfully');
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error in enqueueing emails:', error);
  }
}

// Schedule the cron job to run every day at 8 AM
cron.schedule('0 08 * * * *', () => {
  console.log('Running cron job to enqueue emails at 8 AM');
  enqueueEmails(); // Run the function to enqueue emails at 8 AM
  startEmailWorker()
});

console.log('Cron job started, waiting for scheduled time...');
