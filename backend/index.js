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

// --- START: NEW CORS Configuration for Multiple Origins ---

// List of all frontend URLs that are allowed to connect
const whitelist = [
    process.env.CORS_ORIGIN, // Your main production URL from Render's variables
    'https://fracture-ai-application-96t8nge6m-krishs-projects-5883e3b0.vercel.app' // The specific preview URL
];

const corsOptions = {
    origin: function (origin, callback) {
        // Check if the incoming origin is in our whitelist
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// --- END: NEW CORS Configuration ---

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/history', historyRoutes);

app.get('/', (req, res) => {
    res.send('Fracture Detection API is running!');
});

const PORT = process.env.PORT || 5001;

sequelize.sync().then(() => {
    console.log('✅ Database connected and synced');
    app.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('❌ Unable to connect to the database:', err);
});