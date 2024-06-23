import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage"

import customStyles from "../styles/styles";
import axios from "axios";

import jwt_decode from "jwt-decode"
import { base_url } from "../helper/helper";
import axiosInstance from "../helper/axiosInstance";

const LoginScreen = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showLoader, setShowLoader] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        // check Login status 
        const checkLoginStatus = async () => {
            try {
                setShowLoader(true)
                // get accessToken form async storage 
                const accessToken = await AsyncStorage.getItem("accessToken")
                // console.log(accessToken);
                if (accessToken) {
                    // set userId in context 
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
            // const response = await axiosInstance.post(`users/login`, formData)
            const response = await axios.post(`${base_url}/users/login`, formData)

            if (response.data.statusCode == 200) {
                Alert.alert("Logged In", response.data.message)
                await AsyncStorage.setItem("accessToken", response.data.data.accessToken)
                console.log("New Access Token stored:", response.data.data.accessToken);
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
        <SafeAreaView style={styles.container}>
            {showLoader && (
                <ActivityIndicator style={styles.loader} size={65} color="#FFFFFF" />
            )}
            <View style={styles.logoContainer}>
                <Image source={require("../../assets/logo.jpg")} style={styles.logo} />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    onChangeText={(text) => setUsername(text)}
                    value={username}
                    placeholder="Enter your username"
                    style={customStyles.inputText}
                    placeholderTextColor="white"
                />
                <TextInput
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="Enter your Email"
                    style={customStyles.inputText}
                    placeholderTextColor="white"
                />
                <TextInput
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    placeholder="Enter your Password"
                    style={customStyles.inputText}
                    placeholderTextColor="white"
                    secureTextEntry
                />
                <TouchableOpacity onPress={loginHandler} style={customStyles.colorFullButton}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>
                <Pressable onPress={() => navigation.navigate("Register")}>
                    <Text style={styles.signUpText}>
                        If You have no account{" "}
                        <Text style={styles.signUpLink}>Sign Up</Text>
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#121212",
        gap: 30,
    },
    loader: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "#00000084",
        zIndex: 99,
    },
    logoContainer: {},
    logo: {
        width: 170,
        height: 170,
    },
    inputContainer: {
        flexDirection: "column",
        gap: 15,
        alignItems: "center",
        width: "100%",
    },
    loginText: {
        textAlign: "center",
        fontSize: 15,
        fontWeight: "bold",
    },
    signUpText: {
        color: "white",
        fontSize: 16,
    },
    signUpLink: {
        color: "#AE7AFF",
        fontSize: 16,
    },
});

export default LoginScreen;