import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Pressable,
} from "react-native";
import React, { useContext, useEffect,useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import styles from "../styles/styles";
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios";
import { UserType } from '../UserContext';



const HomeScreen = () => {
  const category = [
    {
      id: "0",
      name: "All",
    },
    {
      id: "1",
      name: "Music",
    },
    {
      id: "2",
      name: "Gaming",
    },
    {
      id: "3",
      name: "Science",
    },
    {
      id: "4",
      name: "JavaScript",
    },
    {
      id: "5",
      name: "Movies",
    },
    {
      id: "6",
      name: "Live",
    },
  ];

  const [user, setUser] = useContext(UserType);
  console.log("user ::", user);


  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {

        const accessToken = await AsyncStorage.getItem("accessToken")
        const response = await axios.get("http://192.168.43.207:6100/api/v1/users/current-user", {
          headers: {
            Authorization: `${accessToken}`,
          }
        })

        console.log(response.data.statusCode);
        if (response.data.statusCode === 200) {
          setUser(response.data.data)
        }

      } catch (error) {
        console.log("error :: ", error);
      }
    }
    fetchCurrentUser();
  }, [])


  return (
    <SafeAreaView style={{ backgroundColor: "#333", color: "white" }}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={{}}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 15,
            paddingVertical: 7
          }}
        >
          <Image
            style={{ width: 50, height: 50 }}
            // source={require("../assets/6372187-middle.png")}
            source={require("../assets/logo.jpg")}
          />
          <Feather name="search" size={24} color="white" />
        </View>

        {/* Category */}
        {/* <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          {category.map((item) => (
            <Pressable
              style={{
                borderWidth: 0.5,
                borderColor: "white",
                paddingHorizontal: 15,
                paddingVertical: 7,
                margin: 7,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: "white" }}>{item.name}</Text>
            </Pressable>
          ))}
        </ScrollView> */}

      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;