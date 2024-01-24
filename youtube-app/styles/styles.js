import { StyleSheet } from "react-native";

export default customStyles = StyleSheet.create({
    container: {
    },
    button : {
        backgroundColor: "#333",
        paddingHorizontal: 10,
        paddingVertical: 10,
        color: 'white'
    },
    colorFullButton: {
        backgroundColor: "#AE7AFF",
        paddingHorizontal: 10,
        paddingVertical: 15,
        width: "90%",
        borderRadius: 3,

        
    },
    inputText: {
        borderWidth: 0.4,
        color: "white",
        borderColor: "white",
        paddingHorizontal: 20,
        paddingVertical: 10,
        fontSize: 18,
        width: "90%",
        borderRadius: 2
    },
    imageButton : {
        borderWidth: 1,
        borderColor: "#3573E4",
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 15,
        width: "100%"
    }
  });
  


//   <TouchableOpacity>
//               <Text style={styles.button}>Login</Text>
//             </TouchableOpacity>
//             <TouchableOpacity>
//               <Text style={styles.button}>Sign up</Text>
//             </TouchableOpacity>