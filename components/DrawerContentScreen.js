import React, {Component} from 'react';
import { DrawerItem, DrawerContentScrollView } from '@react-navigation/drawer';
import {View, StyleSheet} from "react-native";
import { Icon } from 'react-native-elements'


export class DrawerContentScreen extends Component {
    
  
    handlerConfiguration(){
        console.log("Configuration");
    }


    render(){

        return(
            <View style={styles.container}>

                <DrawerContentScrollView {...this.props}>
                    <View style={styles.topDrawer}>
                        <DrawerItem 
                            icon={() => <Icon type="material-community" name="home-outline" style={styles.icon}/>}
                            label="Home"
                            onPress={() => this.props.navigation.navigate("Home")}
                        />
                        <DrawerItem 
                            icon={() => <Icon type="material-community" name="calendar" style={styles.icon}/>}
                            label="Buscar Dispositivos"
                            onPress={() => this.props.navigation.navigate("Search Devices")}
                        />
                    </View>
                </DrawerContentScrollView>
                
                
            </View> 
            )
            
        
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    icon:{
        color:'#517fa4'
    },
    topDrawer:{
        flex:1   
    },
    bottomDrawer: {
        flex:-1,
        justifyContent: 'flex-end',
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1,
    }
});