import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Button } from 'react-native';
import React, { useEffect } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App() {
  const [hasPermission, setHasPermission] = React.useState(false);
  const [scanned, setScanned] = React.useState();
  const [processing, setProcessing] = React.useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  const handleBarCodeScanned = async({ type, data }) => {  
    if(processing) return;
    setScanned(true);
    console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
    const response = await fetch('http://localhost:8003/actor/scan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify("051111407592"),
        });
        console.log(response);

        if (response.ok) {
            alert('User created successfully');
            navigate('/');
        }else{
            alert('Failed to create user');
        }
    setProcessing(false);

  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}/>
        {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(undefined)} />}
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
