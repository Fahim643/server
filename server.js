
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;  // Use environment port or fallback to 3000

// Enable CORS to allow cross-origin requests from your frontend
app.use(cors());

// Middleware to parse JSON body in POST requests
app.use(express.json());

// Serve static files (e.g., your HTML, CSS, JS for frontend)
app.use(express.static(path.join(__dirname, 'public')));  // Assuming 'public' is where static files are

// POST route to handle placing an order
app.post('/api/place-order', (req, res) => {
    const orderData = req.body;

    // Validate order data
    if (!orderData || !orderData.products || orderData.products.length === 0) {
        return res.status(400).json({ error: 'No products in the order' });
    }

    // Save order details to 'orders.json'
    const ordersFilePath = path.join(__dirname, 'orders.json');
    let orders = [];
    if (fs.existsSync(ordersFilePath)) {
        orders = JSON.parse(fs.readFileSync(ordersFilePath, 'utf8'));
    }

    // Add the new order to the orders list
    orders.push(orderData);

    // Write the updated orders list to the file
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));

    // Send a response back to the frontend
    res.status(201).json({ message: 'Order placed successfully!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
