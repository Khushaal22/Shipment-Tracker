require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const shipmentRoutes = require('./routes/shipmentRoutes');
const trackRoutes = require('./routes/trackRoutes');

const app = express();

connectDB();

app.use(cors())
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/track', trackRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));