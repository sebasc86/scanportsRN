import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Header} from 'react-native-elements';
import {Icon, Container, Button} from 'native-base';

const HomeScreen = ({navigation}) => {

  
  return (
    
    <Container>
      <Header
        centerComponent={{
          text: 'HOME',
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
        <Text style={styles.text}>Descubrimiento de equipos</Text>
        <Button
          block
          style={styles.button}
          onPress={() => navigation.navigate('Search Devices')}>
          <Text style={styles.textButton}>Buscar dispositivos</Text>
        </Button>
      </View>
    </Container>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2%',
  },
  button: {
    color: '#3D6DCC',
  },
  text: {
    color: '#000000',
    fontSize: 18,
    marginBottom: '2%',
  },
  textButton: {
    color: '#FFFFFF',
    fontSize: 15,
  },
});

export default HomeScreen;
