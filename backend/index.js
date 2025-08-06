require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const User = require('./models/User');
const authRoutes = require('./routes/auth');
const predictRoutes = require('./routes/predict');
const Prediction = require('./models/Prediction');
const app = express();
const historyRoutes = require('./routes/history');

// --- START: CORS Configuration ---
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
// --- END: CORS Configuration ---

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/history', historyRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Fracture Detection API is running!');
});

const PORT = process.env.PORT || 5001;

// Connect to database and start server
sequelize.sync().then(() => {
    console.log('✅ Database connected and synced');
    app.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('❌ Unable to connect to the database:', err);
});