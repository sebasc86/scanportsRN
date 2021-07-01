

import React, {useEffect, useState} from 'react';
import { TouchableOpacity, ActivityIndicator, NativeModules, View, StyleSheet, ImageBackground, FlatList, SafeAreaView} from 'react-native';
import { Icon, Container, Button, Text} from 'native-base';
import { Header } from 'react-native-elements';
const connectionStatusModule = NativeModules.ConnectionStatusModule;


 
const SearchDevices = ({ navigation, results, setIp }) => {

  const [devicesConnect, setDeviceConnect ] = useState()
  const [scan, setScan ] = useState(false)
  const [devicePrueba, setDevicePrueba ] = useState([])

  const ip_connect =  async (iparraylist) => {
    
    let obj = []

    let ip = await connectionStatusModule.scanIp(iparraylist)
    
    for (let i=0;i<ip.length;i++){
      console.log(ip[i]);
      obj.push(ip[i]);
    }

    
    setDeviceConnect(obj)
    setTimeout(() => setScan(true), 5)
  }

  // const ip_connectPrueba =  async (ipAddress) => {
    
  //   setScan(true)

  //   for (let i = 0; i < ipAddress.length; i++) {
  //     let ipA = ipAddress[i];
  //     const ip = await connectionStatusModule.scanIpPrueba(ipAddress[i])
  //     if(ip) {

  //       if(devicePrueba.includes(ipA) != true) {
  //         setDevicePrueba ([
  //           ...devicePrueba,
  //           ipA
  //         ])
  //         console.log(ipA)
  //         devicePrueba.push(ipA)
  //       }
  //     }
  //   }  

  //   setScan(false)
  //   // setDeviceConnect(obj)
  //    //setTimeout(() => )
  // }


  useEffect(() => {

    ip_connect(results.ipRange) 

    //ip_connectPrueba(results.ipRange);
    //console.log(devicePrueba)
   
   }, [])


       
        if(scan === false){
       
          return (
          
            <Container >
              
              <View style={styles.container}>
                
                
                <ActivityIndicator size="large" color="#0000ff"/>
                <Text >Cargando por favor espere ....</Text>
                
              </View>
            
            </Container>
          ) 

        } else if(scan === true) {
          return (
          
            <Container >

            <Header
            centerComponent={{ text: "RESULTADO", style: { color: "#fff" } }}
            leftComponent={
              <Icon name="menu" onPress={() => this.props.navigation.openDrawer()} />
            }
            containerStyle={{
              backgroundColor: "#3D6DCC",
              justifyContent: "space-around",
            }}
            />
                    
                  <FlatList
                    data={devicesConnect}
                    renderItem={({ item }) => {
                      return (                     
                          <Button
                            iconRight
                            light
                            full
                            style={styles.button}
                            onPress= 
                            {() => {
                              setIp({item})
                              navigation.navigate("Device")
                            }}
                          >
                            
                          
                          <Text >{item}</Text>
                          <Text >Mas información</Text>
                          <Icon name="arrow-forward" />
                          
                          </Button>
                    
                      );
                    }}
                  
                    keyExtractor={(item, index) => index++}
                  />

                    <Button
                        block
                        style={styles.buttonBack}
                        onPress={() => {
                          setScan(false)
                          setTimeout(() => {
                            ip_connect(results.ipRange);
                            // ip_connect(results.ipRange)
                          }, 10);
                        }}
                    >
                        <Text style={styles.textButton}>Volver a buscar</Text>
                    </Button>
                  
            </Container>
          );
        } 
        
       
        
      
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: "2%"
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
      },
    text: {
      color: '#000000', 
      fontSize: 18
    },
    buttonBack: {
      color: '#3D6DCC',

    },
    item: {
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 32,
    },
    horizontal: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 10
    },
    list: {
      backgroundColor: '#f9c2ff',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    button: {
      textAlign: "left",
      marginBottom: "0.5%", 
      backgroundColor: "#DDDDDD",
      padding: 0
    },
    countContainer: {
      alignItems: "center",
      padding: 10
    }
  });
 
export default SearchDevices;