const jwt = require('jsonwebtoken');
const grpc = require('@grpc/grpc-js');

// Your JWT secret key (should be in environment variables in production)
//const JWT_SECRET = 'your-secret-key';

const authenticateUser = (call, callback) => {
    const { token } = call.request;

    if (!token) {
        return callback(null, {
            authenticated: false,
            message: 'No token provided',
            userId: ''
        });
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, "ROBIN@123");
      
        console.log("Decoded Token:", decoded);

        
        callback(null, {
            authenticated: true,
            message: 'Authentication successfulffff',
            userId: decoded._id // Assuming your token has userId
        });
    } catch (error) {
        callback(null, {
            authenticated: false,
            message: 'Invalid token',
            userId: ''
        });
    }
};

module.exports = {
    authenticateUser
};