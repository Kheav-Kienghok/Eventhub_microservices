import { createProxyMiddleware } from 'http-proxy-middleware';
import express from 'express';
import 'dotenv/config';
import jwt from 'jsonwebtoken';


const app = express();

// -------------------------- Environment Variables ------------------ //
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
const EVENT_SERVICE_URL = process.env.EVENT_SERVICE_URL;
const MODIFY_DEL_SERVICE_URL = process.env.MODIFY_DEL_SERVICE_URL;
const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL;
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;


// ------------------ Middleware ------------------ //
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user info to the request headers for downstream services
    req.user = decoded;  // This can be used to check the user role, etc.
    req.headers['x-user-id'] = decoded.id;  // Forward user ID to downstream services
    req.headers['x-user-role'] = decoded.role;  // Optionally, forward role if needed

    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

const checkUserRole = (allowedRoles) => {
    return (req, res, next) => {
      console.log("Checking role...", req.user?.role);
      const role = req.user?.role;
      if (!allowedRoles.includes(role)) {
        return res.status(403).json({ message: 'Access denied: insufficient permissions' });
      }
      next();
    };
};


// ------------------ Routes ------------------ //

// No auth required
app.use('/auth', createProxyMiddleware({
    target: AUTH_SERVICE_URL, 
    changeOrigin: true
}));


app.use('/event',
  verifyToken,
  checkUserRole(['admin']), // Only admin can modify or delete events
  createProxyMiddleware({
    target: MODIFY_DEL_SERVICE_URL,
    changeOrigin: true
  })
);

// Booking routes (for regular users)
app.use('/bookings',
  verifyToken,
  createProxyMiddleware({
    target: BOOKING_SERVICE_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
      if (req.user) {
        proxyReq.setHeader('x-user-id', req.user.id); // Send user ID
        proxyReq.setHeader('x-user-role', req.user.role); // Send user role
      }
    }
  })
);

app.use('/events',
  verifyToken,
  createProxyMiddleware({
    target: EVENT_SERVICE_URL,
    changeOrigin: true,
  })
);


// ------------------ Start Server ------------------ //
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});