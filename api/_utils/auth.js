
import jwt from 'jsonwebtoken';

const authServices = {
    async verifyToken(req) {
        var token;
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7, authHeader.length);
        } else {
            throw new Error("Token not found");
        }
        try {
            const result = await jwt.verify(token, process.env.JWT_SECRET);
            return result;
        } catch (error) {
            throw new Error(error||"Not authorized");
        }
    }
}


export default authServices;