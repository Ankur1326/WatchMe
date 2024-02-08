import { ActivityIndicator, Alert, Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View, } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import customStyles from "../styles/styles";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

import { base_url } from "../helper/helper";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [avatarImage, setAvatarImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [username, setUsername] = useState("ankurswami");
  const [fullName, setFullName] = useState("Ankur Swami");
  const [email, setEmail] = useState("swamiankur@gmail.com");
  const [password, setPassword] = useState("Ankur@123123");
  const [showLoader, setShowLoader] = useState(false);

  const registerHandler = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", { uri: avatarImage, name: "avatar.jpg", type: "image/jpg", });
    formData.append("coverImage", { uri: coverImage, name: "coverImage.jpg", type: "image/jpg", });

    // check if all fiend are not empty
    if (formData.username !== "" && formData.fullName !== "" && formData.email !== "" && formData.password !== "" && formData.avater !== null) {
      try {
        setShowLoader(true);
        const response = await axios.post(`${base_url}/users/register`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        }
        );
        console.log(response.data);

        if (response.data.statusCode === 200) {
          // Handle success
          Alert.alert("Success", response.data.message);
          navigation.navigate("Login");
        }
      } catch (error) {
        if (error.response) {
          const responseData = error.response.data;

          // Check if the response is in HTML format
          if (typeof responseData === "string" && responseData.startsWith("<!DOCTYPE html>")) {
            // Extract the error message from the HTML response using a regular expression
            const errorMessageMatch = responseData.match(/<pre>(.*?)<\/pre>/i);
            const errorMessage = errorMessageMatch ? errorMessageMatch[1] : "An error occurred.";

            // Display an alert with the extracted error message
            Alert.alert(errorMessage);
          }
        }
      } finally { setShowLoader(false) }
    } else { console.log("all field are required"); }
  };

  const pickImage = async (image) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      if (image === "avatar") {
        // set Image url 
        setAvatarImage(result.assets[0].uri)
      }
      if (image === "coverImage") {
        setCoverImage(result.assets[0].uri);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#121212", gap: 30, }}>
      {/* loader */}
      {showLoader && (
        <ActivityIndicator style={{ position: "absolute", width: "100%", height: "100%", backgroundColor: "#00000084", zIndex: 99, }} size={65} color="#FFFFFF" />
      )}
      <ScrollView style={{ width: "100%" }} showsVerticalScrollIndicator={false} >
        <View style={{ flexDirection: "column", alignItems: "center" }}>
          <View>
            <Image source={require("../assets/logo.jpg")} style={{ width: 150, height: 150 }} />
          </View>
          <View style={{ flexDirection: "column", gap: 10, alignItems: "center", width: "100%", }}>
            <TextInput onChangeText={(text) => setUsername(text)} value={username} placeholder="Enter your username" style={customStyles.inputText} placeholderTextColor="#999" />
            <TextInput onChangeText={(text) => setFullName(text)} value={fullName} placeholder="Enter your fullName" style={customStyles.inputText} placeholderTextColor="#999" />
            <TextInput onChangeText={(text) => setEmail(text)} value={email} placeholder="Enter your Email" style={customStyles.inputText} placeholderTextColor="#999" />
            <TextInput onChangeText={(text) => setPassword(text)} value={password} placeholder="Enter your Pasword" style={customStyles.inputText} placeholderTextColor="#999" secureTextEntry />

            <View style={{ width: "90%", flexDirection: "column", alignItems: "center", }}>
              <TouchableOpacity onPress={() => pickImage("avatar")} style={customStyles.imageButton} >
                <Text style={{ textAlign: "center", fontSize: 15, fontWeight: "bold", color: "#777", }}>Pick avatar image</Text>
              </TouchableOpacity>
              {avatarImage && (
                <Image source={{ uri: avatarImage }} style={{ width: 200, height: 200, marginTop: 20, borderWidth: 1, borderColor: "white", borderRadius: 100, }} />
              )}
            </View>

            <View style={{ width: "90%", flexDirection: "column", alignItems: "center", }}>
              <TouchableOpacity onPress={() => pickImage("coverImage")} style={customStyles.imageButton}>
                <Text style={{ textAlign: "center", fontSize: 15, fontWeight: "bold", color: "#888", }}> Pick avatar image</Text>
              </TouchableOpacity>

              {coverImage && (
                <Image source={{ uri: coverImage }} style={{ width: 300, height: 200, marginTop: 20, borderWidth: 1, borderColor: "white", }} />
              )}
            </View>

            <TouchableOpacity onPress={() => registerHandler()} style={customStyles.colorFullButton} >
              <Text style={{ textAlign: "center", fontSize: 15, fontWeight: "bold", }}>Sign Up</Text>
            </TouchableOpacity>

            <Pressable onPress={() => navigation.navigate("Login")}>
              <Text style={{ color: "white", fontSize: 16 }}>
                If You have a account{" "}
                <Text style={{ color: "#3573E4", fontSize: 16 }}>Login</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
