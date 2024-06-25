export const generateCandlestickData = () => {
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

export const generateOrderBookData = () => {
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
  
