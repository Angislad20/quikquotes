const express = require('express');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const resetTokenRoutes = require('./routes/resetTokenRoutes')
app.use('/api/auth', authRoutes);
app.use('/api/auth', resetTokenRoutes)


app.listen(process.env.PORT, () => {
    console.log(`Auth service running on port ${process.env.PORT}`);
});