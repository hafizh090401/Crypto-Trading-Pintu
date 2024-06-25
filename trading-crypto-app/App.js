import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Text } from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CandleChart from './components/CandlestickChart';
import OrderBook from './components/OrderBook';
import Svg, { G, Path } from "react-native-svg";

const SVGComponent = (props) => (
  <Svg
    width="40px"
    height="40px"
    viewBox="0 0 32 32"
    id="_x3C_Layer_x3E_"
    xmlSpace="preserve"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <G id="Ripple_XRP_2_">
      <G id="XMLID_403_">
        <Path
          className="st0"
          d="M26.25,3.89h4.19l-8.72,8.64c-3.16,3.12-8.28,3.12-11.44,0L1.55,3.89h4.2l6.63,6.56    c2,1.98,5.23,1.98,7.24,0L26.25,3.89z"
          id="XMLID_405_"
          fill="#fff"
        />
        <Path
          className="st0"
          d="M5.69,28.11H1.5l8.78-8.69c3.16-3.13,8.28-3.13,11.44,0l8.78,8.69h-4.19l-6.69-6.62    c-2-1.98-5.23-1.98-7.24,0L5.69,28.11z"
          id="XMLID_404_"
          fill="#fff"
        />
      </G>
      <G id="XMLID_400_">
        <Path
          className="st1"
          d="M26.25,3.89h4.19l-8.72,8.64c-3.16,3.12-8.28,3.12-11.44,0L1.55,3.89h4.2l6.63,6.56    c2,1.98,5.23,1.98,7.24,0L26.25,3.89z"
          id="XMLID_402_"
          fill="#fff"
        />
        <Path
          className="st1"
          d="M5.69,28.11H1.5l8.78-8.69c3.16-3.13,8.28-3.13,11.44,0l8.78,8.69h-4.19l-6.69-6.62    c-2-1.98-5.23-1.98-7.24,0L5.69,28.11z"
          id="XMLID_401_"
          fill="#fff"
        />
      </G>
    </G>
  </Svg>
);

const App = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}><Text><SVGComponent /> </Text><Text style={styles.headerText}> Overview </Text></View>
          <View style={styles.section}>
            <CandleChart />
          </View>
          <View style={styles.section}>
            <OrderBook />
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 600,
    marginTop: 8,
  },
  content: {
    padding: 10,
  },
  section: {
    marginVertical: 10,
  },
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
  }
});

export default App;
