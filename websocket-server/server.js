const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.PORT || 8080;

// WebSocket server initialization
const wss = new WebSocket.Server({ noServer: true });

// Function to generate dummy candlestick data
const generateCandlestickData = () => {
    const open = Math.random() * 100;
    const close = open + Math.random() * (100 - open) - Math.random() * open;
    const high = Math.max(open, close) + Math.random() * (100 - Math.max(open, close));
    const low = Math.min(open, close) - Math.random() * Math.min(open, close);
    
    return {
        timestamp: Date.now(),
        open: open.toFixed(2),
        high: high.toFixed(2),
        low: low.toFixed(2),
        close: close.toFixed(2),
    };
};

// Function to generate dummy order book data
const generateOrderBookData = () => {
    const generateOrder = () => ({
        price: (Math.random() * 100).toFixed(2),
        quantity: (Math.random() * 10).toFixed(2)
    });
  
    const bids = [];
    const asks = [];

    for (let i = 0; i < 2; i++) {
        bids.push(generateOrder());
    }

    for (let i = 0; i < 2; i++) {
        asks.push(generateOrder());
    }
  
    bids.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    asks.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  
    return { bids, asks };
};

// WebSocket server event: handle new connections
wss.on('connection', ws => {
    console.log('Client connected');

    // Function to send initial 10 dummy data entries
    const sendInitialData = () => {
        for (let i = 0; i < 10; i++) {
            const data = {
                candlestick: generateCandlestickData(),
                orderBook: generateOrderBookData(),
                type: 'initial'  // Add a type to distinguish initial data
            };
            ws.send(JSON.stringify(data));
        }
    };

    // Send initial data immediately upon connection
    sendInitialData();

    // Function to send regular updates every 2 seconds
    const interval = setInterval(() => {
        const data = {
            candlestick: generateCandlestickData(),
            orderBook: generateOrderBookData(),
            type: 'update'  // Add a type to distinguish updates
        };
        ws.send(JSON.stringify(data));
    }, 2000);

    ws.on('close', () => {
        console.log('Client disconnected');
        clearInterval(interval);
    });
});

// Create an HTTP server
const server = http.createServer((req, res) => {
    // Handle HTTP requests here if needed
    if (req.url === '/') {
        // Generate new data for candlestick and order book
        const candlestick = generateCandlestickData();
        const orderBook = generateOrderBookData();
        
        // Prepare response
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const responseData = { candlestick, orderBook };
        console.log(responseData);
        res.end(JSON.stringify(responseData));
    } else if (req.url === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>About Page</h1><p>This is a WebSocket server running on Node.js.</p>');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

// Upgrade HTTP server to support WebSocket
server.on('upgrade', (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
    });
});

// Start listening on the specified port
server.listen(PORT, () => {
    console.log(`WebSocket server is running on port ${PORT}`);
});

