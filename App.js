import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, PermissionsAndroid, Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { ScrollView, TextInput, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import XLSX from 'xlsx';
import * as Sharing from 'expo-sharing';

export default function App() {
  const [item, setItem] = React.useState('');
  const [quantity, setQuantity] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [paymentMode, setPaymentMode] = React.useState('');
  const [date, setDate] = React.useState('');

  const [data, setData] = React.useState([]);

  const handleSubmit = () => {
    const entry = {
      date: date,
      item: item,
      quantity: quantity,
      amount: amount,
      paymentMode: paymentMode,
      id: data.length.toString()
    };
    setData(prevData => [...prevData, entry]);
    setDate('');
    setItem('');
    setQuantity('');
    setAmount('');
    setPaymentMode('');
    console.log(data);
  };

  const genrateExcel = async () => {

    let wb = XLSX.utils.book_new();
    console.log(wb);


    const aoaData = [csvHeader].concat(data.map(item => [item.date, item.item, item.quantity, item.amount, item.paymentMode]));
    console.log(aoaData);
    let ws = XLSX.utils.aoa_to_sheet(aoaData);
    XLSX.utils.book_append_sheet(wb, ws, 'Sales_history', true);

    const base64 = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
    const fileName = FileSystem.documentDirectory + 'Sales_historyFirst.xlsx';
    FileSystem.writeAsStringAsync(fileName, base64, { encoding: FileSystem.EncodingType.Base64 })
      .then(() => {
        console.log('Excel file has been written successfully!' + fileName);
        Sharing.shareAsync(fileName);
      })
      .catch(error => {
        console.error('An error occurred while writing the Excel file:', error);
      });
  }
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.date}</Text>
      <Text style={styles.cell}>{item.item}</Text>
      <Text style={styles.cell}>{item.quantity}</Text>
      <Text style={styles.cell}>{item.amount}</Text>
      <Text style={styles.cell}>{item.paymentMode}</Text>
    </View>
  )
  const csvHeader = ['Date', 'Item', 'Quantity', 'Amount', 'Payment Mode'];

  return (
    <View style={styles.container}>
      <ScrollView >
        <View style={{}}>
          <TextInput
            style={styles.input}
            placeholder="Date"
            value={date}
            onChangeText={setDate}
          />
          <TextInput
            style={styles.input}
            placeholder="Item"
            value={item}
            onChangeText={setItem}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            value={quantity}
            onChangeText={setQuantity}
          />
          <TextInput
            style={styles.input}
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
          />
          <TextInput
            style={styles.input}
            placeholder="Payment Mode"
            value={paymentMode}
            onChangeText={setPaymentMode}
          />

          <Button title="Submit" onPress={handleSubmit} />
        </View>
        <View style={styles.header}>
          <Text style={styles.heading}>Date</Text>
          <Text style={styles.heading}>Item</Text>
          <Text style={styles.heading}>Quantity</Text>
          <Text style={styles.heading}>Amount</Text>
          <Text style={styles.heading}>Payment Mode</Text>
        </View>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          style={{ backgroundColor: '#BEBEBE', margin: '1px' }}>
        </FlatList>
        <Button style={styles.exportButton} title="Export Data" onPress={genrateExcel} />
      </ScrollView>

    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 30,
    paddingHorizontal: 30,
    marginTop: 50,
    height: Dimensions.get('window').height,
  },
  headerToBar: {
    backgroundColor: 'blue',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 10,
  },
  input: {
    height: '10%',
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    marginHorizontal: 10,
    elevation: 2,
    borderRadius: 3,
    borderColor: 'gray',
    border: 10,
    backgroundColor: 'white',

  },
  cell: {
    fontSize: 15,
    fontFamily: 'sans-serif',
    textAlign: 'left',
    flex: 1,
  },
  heading: {
    flex: 1,
    fontFamily: 'sans-serif',
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  exportButton: {
    position: 'fixed',
    bottom: 0,
    height: '10%',
    width: '100%',
  },
});