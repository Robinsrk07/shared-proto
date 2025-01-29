const amqp = require('amqplib');
const nodemailer = require('nodemailer');
const { sendNotification } = require('./sendNoifications');  // Import your sendNotification function


console.log("its called");

async function startEmailWorker() {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'emailQueue'; // Name of the queue

    // Ensure the queue exists
    await channel.assertQueue(queue, { durable: true });

    // Process messages in the queue
    console.log('Email worker started, waiting for messages...');

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        // Parse the message from the queue
        const { receiverEmail, status } = JSON.parse(msg.content.toString());

        console.log(`Received email request for ${receiverEmail} with status ${status}`);

        try {
          // Send the notification email
          await sendNotification(receiverEmail, status);
          console.log(`Email successfully sent to ${receiverEmail}`);

          // Acknowledge the message to remove it from the queue
          channel.ack(msg);
        } catch (error) {
          console.error('Error sending email:', error);
        }
      }
    });

  } catch (error) {
    console.error('Error in email worker:', error);
  }
}

// Start the worker
 module.exports= {startEmailWorker}
