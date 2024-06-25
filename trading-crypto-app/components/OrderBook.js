import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Polygon } from "react-native-svg";

const OrderBook = () => {
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [messageCount, setMessageCount] = useState(0);
  const BuyIcon = (props) => (
    <Svg
      width="10px"
      height="10px"
      viewBox="0 0 15 15"
      id="triangle"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        id="path21090-9"
        d="M7.5385,2&#xA;&#x9;C7.2437,2,7.0502,2.1772,6.9231,2.3846l-5.8462,9.5385C1,12,1,12.1538,1,12.3077C1,12.8462,1.3846,13,1.6923,13h11.6154&#xA;&#x9;C13.6923,13,14,12.8462,14,12.3077c0-0.1538,0-0.2308-0.0769-0.3846L8.1538,2.3846C8.028,2.1765,7.7882,2,7.5385,2z"
        fill="#76ABAE"
      />
    </Svg>
  );
  const SellIcon = (props) => (
    <Svg
      width="10px"
      height="10px"
      viewBox="0 0 15 15"
      id="triangle"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: [{ rotate: '180deg' }] }}  // Correct rotation property
      {...props}
    >
      <Path
        id="path21090-9"
        d="M7.5385,2&#xA;&#x9;C7.2437,2,7.0502,2.1772,6.9231,2.3846l-5.8462,9.5385C1,12,1,12.1538,1,12.3077C1,12.8462,1.3846,13,1.6923,13h11.6154&#xA;&#x9;C13.6923,13,14,12.8462,14,12.3077c0-0.1538,0-0.2308-0.0769-0.3846L8.1538,2.3846C8.028,2.1765,7.7882,2,7.5385,2z"
        fill="#A91D3A"
      />
    </Svg>
  );

  useEffect(() => {
    const ws = new WebSocket('ws://websocketpintu-b530562e63d4.herokuapp.com');
    let interval;

    ws.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      if (receivedData.orderBook) {
        setOrderBook((prevOrderBook) => {
          let newBids = [
            ...prevOrderBook.bids,
            ...receivedData.orderBook.bids.map(bid => ({ ...bid, type: 'bid' }))
          ];
          let newAsks = [
            ...prevOrderBook.asks,
            ...receivedData.orderBook.asks.map(ask => ({ ...ask, type: 'ask' }))
          ];

          // Limit to 20 entries
          if (newBids.length > 20) {
            newBids = newBids.slice(0, 20);
          }
          if (newAsks.length > 20) {
            newAsks = newAsks.slice(0, 20);
          }

          const newMessageCount = messageCount + 1;
          setMessageCount(newMessageCount);

          if (newMessageCount >= 4 && (newBids.length < 20 || newAsks.length < 20)) {
            if (!interval) {
              interval = setInterval(() => {
                if (newBids.length >= 20 && newAsks.length >= 20) {
                  clearInterval(interval);
                  ws.close();
                } else {
                  ws.send(JSON.stringify({ type: 'get_next_order_book' }));  // Assuming this is the message type to fetch new data
                }
              }, 2000);
            }
          }

          if (newBids.length >= 20 && newAsks.length >= 20) {
            if (interval) clearInterval(interval);
            ws.close();
          }

          return { bids: newBids, asks: newAsks };
        });
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error: ", error);
      if (interval) clearInterval(interval);
      ws.close();
    };

    return () => {
      if (interval) clearInterval(interval);
      ws.close();
    };
  }, [messageCount]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Book</Text>
      <View style={styles.orderList}>
        <View style={styles.columnBuy}>
          <Text style={styles.columnTitle}>Bids (Buy Orders)</Text>
          {orderBook.bids.map((bid, index) => (
            <Text key={index} style={styles.orderBuy}>
              <BuyIcon /> {bid.price} - {bid.quantity}
            </Text>
          ))}
        </View>
        <View style={styles.columnSell}>
          <Text style={styles.columnTitle}>Asks (Sell Orders)</Text>
          {orderBook.asks.map((ask, index) => (
            <Text key={index} style={styles.orderSell}>
              <SellIcon /> {ask.price} - {ask.quantity}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#31363F',
    paddingHorizontal: 10,
    paddingVertical: 20,
    alignItems: 'center',
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  orderList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  columnBuy: {
    alignItems: 'flex-start',
  },
  columnSell: {
    alignItems: 'flex-end',
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
  orderBuy: {
    fontSize: 14,
    color: '#76ABAE',
    textAlign: 'left',
  },
  orderSell: {
    fontSize: 14,
    color: '#A91D3A',
  },
});

export default OrderBook;
