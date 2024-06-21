import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage"

import customStyles from "../styles/styles";
import axios from "axios";

import jwt_decode from "jwt-decode"
import { base_url } from "../helper/helper";


const LoginScreen = () => {
    const [username, setUsername] = useState("ankurswami");
    const [email, setEmail] = useState("swamiankur@gmail.com");
    const [password, setPassword] = useState("ankurswami");
    const [showLoader, setShowLoader] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        // check Login status 
        const checkLoginStatus = async () => {
            // await AsyncStorage.removeItem("accessToken") // if need to logged out direcrtly
            try {
                setShowLoader(true)
                const accessToken = await AsyncStorage.getItem("accessToken")
                if (accessToken) {
                    // get accessToken form async storage 
                    const accessToken = await AsyncStorage.getItem("accessToken")
                    const decodedAccessToken = jwt_decode(accessToken) // convert into decode 

                    // set userId in context 
                    // console.log("decodedAccessToken : ", decodedAccessToken._id);
                    navigation.replace("Drawer")
                }
            } catch (error) {
                console.log("error : ", error.message);
            } finally {
                setShowLoader(false)
            }
        }
        checkLoginStatus();
    }, [])

    const loginHandler = useCallback(async () => {
        try {
            setShowLoader(true)
            if (!username || !email || !password) {
                Alert.alert("All fields are requied")
                return;
            }

            const formData = { username, email, password }
            const response = await axios.post(`${base_url}/users/login`, formData)

            if (response.data.statusCode == 200) {
                Alert.alert("Logged In", response.data.message)
                await AsyncStorage.setItem("accessToken", response.data.data.accessToken)
                // await AsyncStorage.setItem("refreshToken", response.data.data.refreshToken)
                navigation.navigate("Drawer")
            }

        } catch (error) {
            console.log("error : ", error);
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

        } finally {
            setShowLoader(false)
        }
    }, [username, email, password])

    return (
        <SafeAreaView style={{ flex: 1, alignItems: "center", backgroundColor: "#121212", gap: 30, }}>
            {showLoader && (
                <ActivityIndicator style={{ position: "absolute", width: "100%", height: "100%", backgroundColor: "#00000084", zIndex: 99, }} size={65} color="#FFFFFF" />
            )}
            <View style={{}}>
                <Image source={require("../../assets/logo.jpg")} style={{ width: 170, height: 170 }} />
            </View>
            <View style={{ flexDirection: "column", gap: 15, alignItems: "center", width: "100%", }}>
                <TextInput onChangeText={(text) => setUsername(text)} value={username} placeholder="Enter your username" style={customStyles.inputText} placeholderTextColor="white" />
                <TextInput onChangeText={(text) => setEmail(text)} value={email} placeholder="Enter your Email" style={customStyles.inputText} placeholderTextColor="white" />
                <TextInput onChangeText={(text) => setPassword(text)} value={password} placeholder="Enter your Pasword" style={customStyles.inputText} placeholderTextColor="white" secureTextEntry />
                <TouchableOpacity onPress={loginHandler} style={customStyles.colorFullButton}>
                    <Text style={{ textAlign: "center", fontSize: 15, fontWeight: "bold" }}>Login</Text>
                </TouchableOpacity>
                <Pressable onPress={() => navigation.navigate("Register")}>
                    <Text style={{ color: "white", fontSize: 16 }}>
                        If You have no account{" "}
                        <Text style={{ color: "#AE7AFF", fontSize: 16 }}>Sign Up</Text>
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({});
