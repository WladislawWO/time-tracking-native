import { AsyncStorage } from 'react-native';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Dimensions } from 'react-native';
import {LineChart} from "react-native-chart-kit";

export default function App() {
  const[time, setTime] = useState(0);
  const[allTime, setAllTime] = useState();
  const[chartLabels, setChartLabels] = useState([]);
  const[chartData, setChartData] = useState([]);

  const toggleTime = async (e) => {
    try{
      const date = new Date().toLocaleString().slice(0,6);
      allTime[date] = allTime[date]+e;
      let newChartData = [...chartData];
      newChartData[newChartData.length-1] = newChartData[newChartData.length-1] + e;
      setChartData(newChartData);
      await AsyncStorage.setItem('data', JSON.stringify(allTime));
      setTime(allTime[date]);
    }catch(error){
      console.log(error);
    }
  }

  const fetchData = async () => {
    try{
      const date = new Date().toLocaleString().slice(0,6);
      let data = await AsyncStorage.getItem('data');
      data = JSON.parse(data);
      if(!data){
        let obj = {
          [date]: 0
        }
        await AsyncStorage.setItem('data', JSON.stringify(obj));
        data = obj;
        console.log('no data');
      }else if(!data.hasOwnProperty(date)){
        data ={
          ...data,
          [date]: 0
        };
        await AsyncStorage.setItem('data', JSON.stringify(data));
        console.log('no Current day')
      } 
      setChartLabels(Object.keys(data).map(k => k).slice(0,7));
      setChartData(Object.values(data).map(v => v).slice(0,7));
      setAllTime(data);
      setTime(data[date]);
    }catch(error){
      console.log(error);
    }
  }
  useEffect(() => {
    fetchData();
    return () => {
      console.log("");
    }
  },[]);

  return (
     <View style={styles.container}>
      <View>
         <View style={styles.navbar}><Text>Time tracking</Text></View>
         <View style={styles.content}><Text style={styles.contentText}>{time}</Text></View>
         <View>
          <LineChart
            data={{
              labels: chartLabels,
              datasets: [
                {
                  data: chartData
                }
              ]
            }}
            width={Dimensions.get("window").width}
            height={220}
            yAxisSuffix="h"
            yAxisInterval={1} 
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 2, 
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
              }
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </View>
       </View>
       <View style={styles.controlls}>
         <View style={styles.btnMius}><Button onPress={() =>toggleTime(-0.5)} color='#57ba98'  title="-"></Button></View>
         <View style={styles.btnPlus}><Button onPress={() =>toggleTime(0.5)} color='#57ba98' title="+" ></Button></View>
       </View>
     </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#65ccb8',
    height: 70,
    alignItems: "center",
    justifyContent: 'center'
  },
  contentText: {
    fontSize: 200,
    color: '#3b945e'
  },
  content: {
    marginTop: 10,
    alignItems: 'center',
  },
  controlls: {
    marginBottom: 40,
    marginHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  btnPlus: {
    backgroundColor: 'red',
    width: '30%',
  },
  btnMius: {
    width: '30%',
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    backgroundColor: '#182628',
    justifyContent: 'space-between'
  },
});
