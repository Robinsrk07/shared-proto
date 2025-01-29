const amqp = require('amqplib');
async function testConnection() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    console.log('RabbitMQ connected successfully');
    await connection.close();
  } catch (error) {
    console.error('Connection failed:', error);
  }
}
testConnection();