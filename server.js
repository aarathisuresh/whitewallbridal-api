import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import galleryRoutes from './routes/gallery.js';

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Robust CORS configuration to accurately match origins and trim trailing slashes
app.use(cors({
  origin: function (origin, callback) {
    // Allow server-to-server or tool-based requests (like Postman/Thunder Client) with no origin
    if (!origin) return callback(null, true);
    
    const isLocalhost = /^http:\/\/localhost(:\d+)?$/.test(origin);
    
    // Clean up the Render environment variable (remove trailing slashes or extra spaces)
    const productionOrigin = process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.trim().replace(/\/$/, "") 
      : null;
      
    // Clean up incoming browser origin string for absolute matching
    const cleanOrigin = origin.trim().replace(/\/$/, "");

    if (isLocalhost || cleanOrigin === productionOrigin) {
      return callback(null, true);
    } else {
      // This prints the exact mismatch string directly into your Render deploy logs for inspection
      console.error(`[CORS Blocked] Browser origin: "${cleanOrigin}" | Allowed env origin: "${productionOrigin}"`);
      return callback(new Error('Not allowed by CORS policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'API running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/gallery', galleryRoutes);

// Fixed 404 Handler (Explicitly defining next to preserve middleware alignment)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Atelier Server Error:', err.message || err);
  
  const statusCode = err.status || (res.statusCode === 200 ? 500 : res.statusCode);
  
  if (res.headersSent) {
    return next(err);
  }

  res.status(statusCode).json({ 
    message: err.message || 'Internal server error' 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
 🎉 White Wall Bridal Boutique API                        
 Server running on port ${PORT}                            
 Environment: ${process.env.NODE_ENV || 'development'}                                          
 API: http://localhost:${PORT}/api                          
  `);
});

export default app;