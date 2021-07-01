import React, {useEffect, useState} from 'react';
import {View, StyleSheet, NativeModules, ActivityIndicator} from 'react-native';
import {Header} from 'react-native-elements';
import {Icon, Container, Button, Content, Card, CardItem, Text} from 'native-base';
const connectionStatusModule = NativeModules.ConnectionStatusModule;

const Device = ({navigation, ip}) => {

    const [scan, setScan ] = useState(false)

    const [infoDeviceIp, setDeviceIp] = useState();

    const [infoTotal, setInfoTotal] = useState(false);

    const[portsOpen, setPortsOpen] = useState();
    
    const objInf = async (ip) => {
      let obj = []
      obj.push({ip: ip})

      await connectionStatusModule.findMac(ip)
      .then(e => {
          obj.push({mac: e})
      })
    

      setTimeout(() => 
      
        connectionStatusModule.connectionStatusNtb(ip)
        .then(e => {
            obj.push({nameNetbios: e})
        })
      )

      

      
        connectionStatusModule.hostName(ip)
          .then(e => {
              obj.push({nameHost: e})
          }).then(
              e => {
                setTimeout(() => {
                  console.log(obj);
                  setDeviceIp(obj);
                  setInfoTotal(true);
                }, 100)
              }
          )
    

    
     
    }

    const getSoftPorts =  async (ip) => {
        setScan(true)
        
        try{
            let obj = []
            let portscan = await connectionStatusModule.findPortsSoft(ip, 4000)
            
            for (let i=0; i < portscan.length; i++){
                obj.push(portscan[i]);
                console.log(portscan[i])

            }
            
            setTimeout(() => {
                if(obj.length !== 0) {
                    setPortsOpen(obj)
                    setScan(false)
                    console.log(obj)
                } else {
                    setPortsOpen(false)
                    setScan(false)
                }
                
            }, 10);
    
            
        }catch(e){
            console.error(e);
        }
        
        console.log("esto es open" + portsOpen) 
    }
    

    const getFullPorts = async (ip)=>{
        
        try{
            let obj = []

            let portscan2 = await connectionStatusModule.findPortsSoft(ip, 2000)

            for (let i=0;i<portscan2.length;i++){
              if(obj.includes(portscan2[i]) != true) {
                obj.push(portscan2[i]);
                console.log(portscan2[i])
              }
            }

            let portscan = await connectionStatusModule.findPortsFull(ip, 200)

            for (let i=0;i<portscan.length;i++){
              if(obj.includes(portscan[i]) != true) {
                obj.push(portscan[i]);
                console.log(portscan[i])
              }  
            }

            
            
    
            setTimeout(() => {
                if(obj.length !== 0) {
                    obj = obj.sort((a, b) => a - b)
                    setPortsOpen(obj)
                    setScan(false)
                    console.log(portscan)
                } else {
                    setPortsOpen(false)
                    setScan(false)
                }
                
            }, 10);

        }catch(e){
            console.error(e);
        }
        
    }


    
    useEffect(() => {

         objInf(ip.item)
         //setInfoTotal(false); 
         //setTimeout(() => setScan(true), 100)    
         setPortsOpen(false);
         console.log("esto es open" + portsOpen) 
        
      }, [infoTotal]);

    
      console.log(portsOpen)
    
    if(infoTotal && scan === false) {
        if(ip.item != infoDeviceIp[0].ip) {
            setPortsOpen(true)
            setInfoTotal(false);
        }
        let renderNetbios;
        if(infoDeviceIp[3] != null) {
            renderNetbios = (
                <CardItem bordered>
                            <Icon style={styles.icon} active name="logo-windows" />
                            <Text style={styles.textif}>Nombre NetBios: </Text>
                            <Text style={styles.text}>{infoDeviceIp[3].nameNetbios}</Text>
                </CardItem>
            )
        }

        let openPorts;
        if(portsOpen != null && portsOpen.length >= 1){
            openPorts = (
                <Card>
                  <CardItem header bordered >    
                      <Icon style={styles.icon} active name="lock-open-outline" />                    
                      <Text style={styles.header}>Puertos Abiertos</Text>
                  </CardItem>
                    {
                      portsOpen.map((port => {     
                        console.log("Entered");                    
                        return (
                          <CardItem bordered key={port}>
                          <Text style={styles.text}>{port}</Text>
                          </CardItem>
                        ) 
                      })
                      )
                    }
                    
                </Card>
            )
        } else if (portsOpen != null && portsOpen == false ){
          console.log(portsOpen.length)
          openPorts = (
             <Card>
              <CardItem header bordered >    
                <Icon style={styles.icon} style={styles.icon} active name="lock-open-outline" />                    
                <Text style={styles.header}>Puertos Abiertos</Text>
              </CardItem>
              <CardItem bordered>
                <Text style={styles.text}>No se encontraron puertos abiertos</Text>
              </CardItem>
            </Card>
          )
      } else {
          openPorts = (
             <Card>
              <CardItem header bordered >    
                <Icon style={styles.icon} active name="lock-open-outline" />                    
                <Text style={styles.header}>Puertos Abiertos</Text>
              </CardItem>
              <CardItem bordered>
                <Text style={styles.text}>Realice la busqueda...</Text>
              </CardItem>
            </Card>
          )
      }

        
        return (
            
            <Container>
            <Header
                centerComponent={{
                text: 'Escaneo De Puertos',
                style: {
                    color: '#fff',
                },
                }}
                leftComponent={<Icon name="menu"/>}
                containerStyle={{
                backgroundColor: '#3D6DCC',
                justifyContent: 'space-around',
                }}
            />
            <Content>
                <Card>
                    <CardItem header bordered >                        
                     <Text style={styles.header}>Información General</Text>
                    </CardItem>
                    <CardItem bordered style={{flexDirection:'row'}}>
                        <Icon style={styles.icon} active  name="checkmark" />
                        <Text style={styles.textif}>Ip: </Text>
                        <Text style={styles.text}>{infoDeviceIp[0].ip}</Text>
                    </CardItem>
                    <CardItem bordered style={{flexDirection:'row'}}>
                        <Icon style={styles.icon} active name="git-network" />
                        <Text style={styles.textif}>Mac Address: </Text>
                        <Text style={styles.text}>{infoDeviceIp[1].mac}</Text>
                    </CardItem>
                    <CardItem bordered style={{flexDirection:'row'}}>
                        <Icon style={styles.icon} active name="md-information-sharp" />
                        <Text style={styles.textif}>Nombre Host: </Text>
                        <Text style={styles.text}>{infoDeviceIp[2].nameHost}</Text>
                    </CardItem>
                    
                    { renderNetbios }

                    { openPorts }

                    <Button
                        block
                        style={styles.button}
                        onPress={() => {
                          setScan(true)
                          setTimeout(() => getSoftPorts(ip.item), 30)
                        }}
                    >
                        <Text style={styles.textButton}>Escaneo de puertos conocidos</Text>
                    </Button>

                    <Button
                        block
                        style={styles.button}
                        onPress={() => {
                          setScan(true)
                          setTimeout(() => getFullPorts(ip.item), 30)
                        }}
                    >
                        <Text style={styles.textButton}>Escaneo full de puertos </Text>
                    </Button>
                    

                    
                </Card>
                
            </Content>
            </Container>
            
        );
    } else if(scan === true){

        return (
          <Container>
          <Header
              centerComponent={{
              text: 'Escaneo de Puertos',
              style: {
                  color: '#fff',
              },
              }}
              leftComponent={<Icon name="menu"/>}
              containerStyle={{
              backgroundColor: '#3D6DCC',
              justifyContent: 'space-around',
              }}
          />
          <Content>
              <Card>
                  <CardItem header bordered >                        
                   <Text style={styles.header}>Información General</Text>
                  </CardItem>
                  <CardItem bordered style={{flexDirection:'row'}}>
                      <Icon style={styles.icon} active  name="checkmark" />
                      <Text style={styles.textif}>Ip: </Text>
                      <Text style={styles.text}>{infoDeviceIp[0].ip}</Text>
                  </CardItem>
                  <CardItem bordered style={{flexDirection:'row'}}>
                      <Icon style={styles.icon} active name="git-network" />
                      <Text style={styles.textif}>Mac Address: </Text>
                      <Text style={styles.text}>{infoDeviceIp[1].mac}</Text>
                  </CardItem>
                  <CardItem bordered style={{flexDirection:'row'}}>
                      <Icon style={styles.icon} active name="md-information-sharp" />
                      <Text style={styles.textif}>Nombre Host: </Text>
                      <Text style={styles.text}>{infoDeviceIp[2].nameHost}</Text>
                  </CardItem>
                
               

                  {infoDeviceIp[3] != null &&
                   <CardItem bordered>
                   <Icon style={styles.icon} active name="logo-windows" />
                   <Text style={styles.textif}>Nombre NetBios: </Text>
                   <Text style={styles.text}>{infoDeviceIp[3].nameNetbios}</Text>
                  </CardItem>
                  
                  }

                  { portsOpen == false && 
                  
                  <Card>
                  <CardItem header bordered >    
                      <Icon style={styles.icon} active name="lock-open-outline" />                    
                      <Text style={styles.header}>Espere... escaneando </Text>
                      <Text style={styles.header}>Puertos Abiertos</Text>
                  </CardItem>
                 </Card>
                
                
                }
                  
                  { portsOpen != null && portsOpen.length >= 1 && 
                  
                    <Card>
                    <CardItem header bordered >    
                        <Icon style={styles.icon} active name="lock-open-outline" />                    
                        <Text style={styles.header}>Espere... escaneando </Text>
                        <Text style={styles.header}>Puertos Abiertos</Text>
                    </CardItem>
                      {
                        portsOpen.map((port => {     
                          console.log("Entered");                    
                          return (
                            <CardItem bordered key={port}>
                            <Text style={styles.text}>{port}</Text>
                            </CardItem>
                          ) 
                        })
                        )
                      }
                      
                   </Card>
                  
                  
                  }
                  
                  <Button
                      disabled
                      block
                      style={styles.button}
                      // onPress={() => {
                      //   setScan(true)
                      //   setTimeout(() => getSoftPorts(ip.item), 30)
                      // }}
                  >
                      <Text style={styles.textButton}>Escaneo de puertos conocidos</Text>
                  </Button>

                  <Button
                      disabled
                      block
                      style={styles.button}
                      // onPress={() => {
                      //   setScan(true)
                      //   setTimeout(() => getFullPorts(ip.item), 30)
                      // }}
                  >
                      <Text style={styles.textButton}>Escaneo full de puertos </Text>
                  </Button>

                  
                  
              </Card>
                  
              
              
              <ActivityIndicator size="large" color="#0000ff"/>
              
          </Content>
          </Container>
          
      );
            
            
    } else {

        return (
            
            <Container>
            <Header
                centerComponent={{
                text: 'Escaneo de Puertos',
                style: {
                    color: '#fff',
                },
                }}
                leftComponent={<Icon name="menu"/>}
                containerStyle={{
                backgroundColor: '#3D6DCC',
                justifyContent: 'space-around',
                }}
            />
            <View style={styles.container}>
                
                <ActivityIndicator size="large" color="#0000ff"/>
                <Text >Cargando por favor espere ....</Text>
                
            </View>
            </Container>

        )

    }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2%',
  },
  button: {
    marginTop: "1%",
    color: '#3D6DCC',
  },
  text: {
    color: '#000000',
    fontSize: 15,
    fontWeight: "bold",
    flexWrap:'wrap',
    paddingRight: "20%",
    flex: 1
  },
  textif: {
    color: '#000000',
    fontSize: 15,
  },
  header: {
    color: '#1007C6',
    fontSize: 16,
    fontWeight: "bold"
  },
  textButton: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  icon: {
    fontSize: 25,
    padding: "0%", 
    marginLeft: "-4%"
  },

});

export default Device;