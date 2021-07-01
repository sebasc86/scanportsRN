/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import 'react-native-gesture-handler';
 const ipaddr = require('ipaddr.js');
 const sip = require('shift8-ip-func');
 
 import React, {useState, useEffect} from 'react';
 
 import {NetworkInfo} from 'react-native-network-info';
 import {NavigationContainer} from '@react-navigation/native';
 import SearchDevices from './components/SearchDevices';
 import HomeScreen from './components/HomeScreen';
 import Device from './components/Device';
 import {createDrawerNavigator} from '@react-navigation/drawer';
 import {DrawerContentScreen} from './components/DrawerContentScreen';


const Drawer = createDrawerNavigator();

const App = () => {
  const [results, setResults] = useState({
    ipv4: null,
    broadcast: '',
    subnet: '',
    prefix: '',
    firstHost: '',
    lastHost: '',
    ipRange: '',
  });

  const [ip, setIp] = useState({});

  const checkNetworkInfo = async () => {
    let broadcast = '';
    const ipv4Address = await NetworkInfo.getIPV4Address().then(ipv4Address => {
      broadcast = ipv4Address.slice(0, -1) + '255';
      return ipv4Address;
    });

    // Get Subnet
    const subnet = await NetworkInfo.getSubnet().then(subnet => {
      const subconv = ipaddr.IPv4.parse(subnet).prefixLengthFromSubnetMask();
      let firstHost = ipaddr.IPv4.networkAddressFromCIDR(
        ipv4Address + '/' + subconv,
      );
      let lastHost = ipaddr.IPv4.broadcastAddressFromCIDR(
        ipv4Address + '/' + subconv,
      );
      const firstHostHex = sip.convertIPtoHex(firstHost);
      const lastHostHex = sip.convertIPtoHex(lastHost);
      let ipRange = sip.getIPRange(firstHostHex, lastHostHex);
      ipRange = ipRange.slice(1); // Elimina la primera ip de la matriz
      firstHost = firstHost.octets.join('.');
      lastHost = lastHost.octets.join('.');

      return {
        subnet: subnet,
        prefix: subconv,
        firstHost: firstHost,
        lastHost: lastHost,
        ipRange: ipRange,
      };
    });

    return {
      ipv4: ipv4Address,
      broadcast: broadcast,
      subnet: subnet.subnet,
      prefix: subnet.prefix,
      firstHost: subnet.firstHost,
      lastHost: subnet.lastHost,
      ipRange: subnet.ipRange,
    };
  };


  useEffect(() => {
    checkNetworkInfo().then(response => {
      setResults(response)
    });
  }, []);

  return (
    <NavigationContainer>
      <>
        <Drawer.Navigator
          initialRouteName="Home"
          headerMode={'none'}
          drawerContent={props => (
            <DrawerContentScreen {...props} isAuthenticated={'true'}  results={results}/>
          )}>
          <Drawer.Screen name="Home" component={HomeScreen}/>
          <Drawer.Screen name="Search Devices">
            {(props) => <SearchDevices {...props} results={results} setIp={setIp}/>}
          </Drawer.Screen>
          <Drawer.Screen name="Device">
            {(props) => <Device {...props} results={results} ip={ip}/>}
          </Drawer.Screen>
        </Drawer.Navigator>
      </>
    </NavigationContainer>
  );
};

export default App;
