const jwt = require('jsonwebtoken');
const { RespondJSONError } = require('../utils/response');

const authMiddleware = (req, res, next) => {
    const auth = req.headers.authorization;
    if(!auth || !auth.startsWith('Bearer ')) 
        return RespondJSONError(res, 401, 'Authorization header is missing');

    try {
        const token = auth.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId;
        next();
    } catch (error) {
        console.error(error);
        return RespondJSONError(res, 401, 'Invalid token');
    }
}

module.exports = authMiddleware;