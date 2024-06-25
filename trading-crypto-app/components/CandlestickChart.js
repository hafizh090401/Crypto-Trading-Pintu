import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { CandlestickChart } from 'react-native-wagmi-charts';
import Svg, { Path } from "react-native-svg";

const CandleChart = () => {
  const [data, setData] = useState([]);
  const EthereumIcon = (props) => (
    <Svg
      width="20px"
      height="20px"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M7.5 0.5L7.88411 0.179908C7.78911 0.0659115 7.64839 0 7.5 0C7.35161 0 7.21089 0.0659115 7.11589 0.179908L7.5 0.5ZM2.5 6.5L2.11589 6.17991C1.97761 6.34585 1.96152 6.58183 2.076 6.765L2.5 6.5ZM7.5 14.5L7.076 14.765C7.16737 14.9112 7.3276 15 7.5 15C7.6724 15 7.83263 14.9112 7.924 14.765L7.5 14.5ZM12.5 6.5L12.924 6.765C13.0385 6.58183 13.0224 6.34585 12.8841 6.17991L12.5 6.5ZM7.5 4.5L7.6857 4.03576L7.5 3.96148L7.3143 4.03576L7.5 4.5ZM7.11589 0.179908L2.11589 6.17991L2.88411 6.82009L7.88411 0.820092L7.11589 0.179908ZM2.076 6.765L7.076 14.765L7.924 14.235L2.924 6.235L2.076 6.765ZM7.924 14.765L12.924 6.765L12.076 6.235L7.076 14.235L7.924 14.765ZM12.8841 6.17991L7.88411 0.179908L7.11589 0.820092L12.1159 6.82009L12.8841 6.17991ZM2.6857 6.96424L7.6857 4.96424L7.3143 4.03576L2.3143 6.03576L2.6857 6.96424ZM7.3143 4.96424L12.3143 6.96424L12.6857 6.03576L7.6857 4.03576L7.3143 4.96424Z"
        fill="#fff"
      />
    </Svg>
  );
  useEffect(() => {
    const ws = new WebSocket('ws://websocketpintu-b530562e63d4.herokuapp.com');
    let messageCount = 0;
    let interval;

    ws.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      setData((prevData) => {
        const newData = [...prevData, receivedData.candlestick];
        messageCount++;

        if (messageCount >= 4 && newData.length < 20) {
          if (!interval) {
            interval = setInterval(() => {
              if (newData.length >= 20) {
                clearInterval(interval);
                ws.close();
              } else {
                ws.send(JSON.stringify({ type: 'get_next_candlestick' }));  // Assuming this is the message type to fetch new data
              }
            }, 2000);
          }
        }

        if (newData.length >= 20) {
          ws.close();
        }

        return newData;
      });
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
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.titleCoin}><EthereumIcon /> Ethereum</Text></View>
      <CandlestickChart.Provider data={data}>
        <CandlestickChart width={300} height={500}>
          <CandlestickChart.Candles positiveColor="#76ABAE" negativeColor="#DC5F00" />
        </CandlestickChart>
      </CandlestickChart.Provider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#31363F',
    padding: 10,
    borderRadius: 20,
  },
  titleCoin: {
    color: 'white', fontSize: 24, marginVertical: 12
  }
});

export default CandleChart;
