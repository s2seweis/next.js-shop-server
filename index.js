const app = require('./src/app.js');
const pool = require('./src/pool/pool.js');
const path = require("path");

// Database configuration for 'DeliveryShopDB'
const deliveryShopConfig = {
  host: "ec2-3-221-177-27.compute-1.amazonaws.com",
  port: 5432,
  database: "ddk22o5m1aqq4q",
  user: "pfirqjhubpfqvp",
  password: "8ab07610e53a224e98c52b12f6bc973d646b92eedf5bb707b3288fc370930a2a",
  ssl: {
    rejectUnauthorized: false,
  },
};

pool
  .connect(deliveryShopConfig)
  .then(() => {
    console.log('Connected to the "DeliveryShopDB" database');

    // Database configuration for 'assets'
    const carsConfig = {
      ...deliveryShopConfig,
      database: 'Assets',
    };

    // Connect to the 'assets' database
    return pool.connectAssets(carsConfig);
  })
  .then(() => {
    console.log('Connected to the "Assets" database');

    // Start the server with a dynamic port for Heroku
    const PORT = process.env.PORT || 3005;

    const expressApp = app();

    expressApp.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });

    // Define the route handler for the root path
    expressApp.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'index.html'));
    });
  })
  .catch((err) => console.error(err));
