import jwt from "jsonwebtoken";

// Verify JWT Token
export const verifyToken = (req, res, next) => {
    try {
        const token =
            req.cookies?.authToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "Access token not found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.user = decoded; // attach decoded payload (e.g. {_id, role, ...})
        next();
    } catch (error) {
        console.error("JWT verification error:", error);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};


// Role-Based Authorization
export const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Permission denied" });
        }
        next();
    };
};
