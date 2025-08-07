// --- DEBUG: Log that the script is starting ---
console.log("Server script starting...");

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

// --- DEBUG: Log environment variables to check if they are loaded ---
console.log("--- Environment Variables ---");
console.log("PORT:", process.env.PORT);
console.log("CORS_ORIGIN:", process.env.CORS_ORIGIN);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "Loaded" : "MISSING!"); // Don't log the actual password
console.log("---------------------------");

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/history', historyRoutes);

app.get('/', (req, res) => {
    res.send('Fracture Detection API is running!');
});

const PORT = process.env.PORT || 5001;

// --- DEBUG: Log before attempting database connection ---
console.log("Attempting to connect to the database...");

sequelize.sync().then(() => {
    console.log('✅ Database connected and synced successfully.');
    app.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`);
    });
}).catch(err => {
    // This is the most important log. If the server is crashing, this should appear.
    console.error('❌ CRITICAL ERROR: Unable to connect to the database or sync models.');
    console.error(err);
});