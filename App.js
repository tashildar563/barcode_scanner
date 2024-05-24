import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import React from "react";
import { ScrollView, TextInput, FlatList } from "react-native";
import * as FileSystem from "expo-file-system";
import XLSX from "xlsx";
import * as Sharing from "expo-sharing";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

export default function App() {
  const [item, setItem] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [paymentMode, setPaymentMode] = React.useState("Cash");
  const [date, setDate] = React.useState(new Date());
  const [showPicker, setShowPicker] = React.useState(false);

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const onChange = ({ type }, selectedDate) => {
    if (type === "set") {
      const currentDate =
        typeof selectedDate === "object" ? selectedDate : date;
      console.log(currentDate.toString());
      setDate(currentDate);
    } else {
      toggleDatePicker();
    }
    setShowPicker(false);
  };

  const [data, setData] = React.useState([]);

  const handleSubmit = () => {
    const entry = {
      date: formatDate(date),
      item: item,
      quantity: quantity,
      amount: amount,
      paymentMode: paymentMode,
      id: data.length.toString(),
    };
    setData((prevData) => [...prevData, entry]);
    setDate(new Date());
    setItem("");
    setQuantity("");
    setAmount("");
    setPaymentMode("Cash");
  };

  const generateExcel = async () => {
    if (data.length > 0) {
      let wb = XLSX.utils.book_new();
      console.log(wb);

      const aoaData = [csvHeader].concat(
        data.map((item, index) => [
          index + 1,
          item.date,
          item.item,
          item.quantity,
          item.amount,
          item.paymentMode,
        ])
      );
      const totalAmount = data.reduce(
        (sum, item) => sum + parseFloat(item.amount),
        0
      );
      aoaData.push(["Total Amount", "", "", "", totalAmount.toFixed(2), ""]);
      let ws = XLSX.utils.aoa_to_sheet(aoaData);
      XLSX.utils.book_append_sheet(wb, ws, "Sales_history", true);

      const base64 = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, "0");
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const year = String(currentDate.getFullYear()).slice(-2);
      const hours = String(currentDate.getHours()).padStart(2, "0");
      const minutes = String(currentDate.getMinutes()).padStart(2, "0");
      const seconds = String(currentDate.getSeconds()).padStart(2, "0");
      const fileName =
        FileSystem.documentDirectory +
        "Sales_historyFirst_" +
        day +
        "-" +
        month +
        "-" +
        year +
        "_" +
        hours +
        "-" +
        minutes +
        "-" +
        seconds +
        ".xlsx";
      FileSystem.writeAsStringAsync(fileName, base64, {
        encoding: FileSystem.EncodingType.Base64,
      })
        .then(() => {
          console.log("Excel file has been written successfully!" + fileName);
          Sharing.shareAsync(fileName);
        })
        .catch((error) => {
          console.error(
            "An error occurred while writing the Excel file:",
            error
          );
        });
    } else {
      alert("No data entered. File not created.");
    }
  };
  const handleRemoveItem = (index) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData.splice(index, 1);
      return newData;
    });
  };
  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{index + 1}</Text>
      <Text style={styles.cell}>{item.date}</Text>
      <Text style={styles.cell}>{item.item}</Text>
      <Text style={styles.cell}>{item.quantity}</Text>
      <Text style={styles.cell}>{item.amount}</Text>
      <Text style={styles.cell}>{item.paymentMode}</Text>
      <TouchableOpacity onPress={() => handleRemoveItem(index)}>
        <Text style={styles.removeButton}>x</Text>
      </TouchableOpacity>
    </View>
  );
  const csvHeader = [
    "Index",
    "Date",
    "Item",
    "Quantity",
    "Amount",
    "Payment Mode",
  ];
  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };

    // Check if date is a Date object
    if (!(date instanceof Date)) {
      // If not, try to convert it to a Date object
      date = new Date(date);
    }

    // Check if date is a valid Date object
    if (isNaN(date.getTime())) {
      // If not, return an error message or handle the error in some other way
      return "Invalid date";
    }

    return date.toLocaleDateString(undefined, options);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={styles.dateContainer}
      >
        <Text>{date ? formatDate(date) : formatDate(new Date())}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={date || new Date()}
          onChange={onChange}
          mode="date"
        />
      )}
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
        onChangeText={(text) => setQuantity(text === "" ? "0" : text)}
        keyboardType="numeric" // Added keyboardType prop
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={(text) => setAmount(text === "" ? "0" : text)}
        keyboardType="numeric" // Added keyboardType prop
      />
      <Picker
        selectedValue={paymentMode}
        onValueChange={(itemValue) => setPaymentMode(itemValue)}
      >
        <Picker.Item label="Cash" value="Cash" />
        <Picker.Item label="UPI" value="UPI" />
      </Picker>
      <TouchableOpacity
        style={{ marginTop: "5" }}
        title="Submit"
        onPress={handleSubmit}
      >
        <Text style={styles.exportButton}>Submit</Text>
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.heading}>SL No</Text>
        <Text style={styles.heading}>Date</Text>
        <Text style={styles.heading}>Item</Text>
        <Text style={styles.heading}>Quantity</Text>
        <Text style={styles.heading}>Amount</Text>
        <Text style={styles.heading}>Payment Mode</Text>
      </View>
      <ScrollView>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        ></FlatList>
      </ScrollView>
      <TouchableOpacity
        style={{ position: "fixed", bottom: "0", color: "red" }}
        title="Export Data"
        onPress={generateExcel}
      >
        <Text style={styles.exportButton}>Export Data</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  dateContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    borderWidth: 1,
    borderColor: "lightskyblue",
    borderRadius: 5,
    paddingRight: 10,
    height: "5%",
    marginBottom: 3,
    width: "100%",
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white", // Modified background color
    paddingVertical: 3,
    paddingHorizontal: 5,
    height: "100%",
    marginTop: 70,
  },
  input: {
    height: "5%",
    width: "100%",
    borderColor: "lightskyblue",
    borderWidth: 1,
    marginBottom: 3,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 2,
    borderRadius: 3,
    borderColor: "gray",
    border: 10,
    backgroundColor: "lightyellow",
  },
  cell: {
    fontSize: 10,
    fontFamily: "sans-serif",
    textAlign: "center",
    flex: 1,
    textAlignVertical: "center",
    borderColor: "seashell",
    borderWidth: 1,
  },
  heading: {
    flex: 1,
    fontFamily: "sans-serif",
    fontSize: 10,
  },
  header: {
    flexDirection: "row",
    padding: 10,
  },
  removeButton: {
    width: 20,
    height: 20,
    color: "red",
    textAlign: "center",
    backgroundColor: "black",
    borderRadius: 10,
  },
  exportButton: {
    textAlignVertical: "center",
    alignSelf: "center",
    width: "50%",
    height: 30,
    textAlign: "center",
    backgroundColor: "tomato",
    marginBottom: 10,
    borderRadius: 5,
  },
});
