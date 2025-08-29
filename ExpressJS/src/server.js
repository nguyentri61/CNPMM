require('dotenv').config();
const cors = require('cors');

const express = require('express');
const configViewEngine = require('./config/viewEngine');
const connectDB = require('./config/database');
const apiRoutes = require('./routes/api');
const { getHomepage } = require('./controllers/homeController');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure view engine
configViewEngine(app);

const webAPI = express.Router();
webAPI.get('/', getHomepage);
app.use('/', webAPI);
app.use('/api', webAPI);
app.use('/v1/api', apiRoutes);
(async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
    }
})();