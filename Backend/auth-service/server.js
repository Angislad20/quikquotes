const express = require('express');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);


app.listen(process.env.PORT, () => {
    console.log(`Auth service running on port ${process.env.PORT}`);
});