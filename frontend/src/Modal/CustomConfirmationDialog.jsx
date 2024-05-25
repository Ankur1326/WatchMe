import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from 'expo-theme-switcher'; // If you're using Expo Theme Switcher
import { MaterialIcons, AntDesign } from '@expo/vector-icons'; // Import your desired icons

const CustomConfirmationDialog = ({ title, message, onCancel, onConfirm, showConfirmation }) => {
    const { currentTheme } = useTheme();
    
    return (
        <Modal
            transparent={true}
            visible={showConfirmation}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "transparent" }} >
                <View style={[{ padding: 20, borderRadius: 10, elevation: 5, width: "85%", alignItems: 'center', flexDirection: 'column', gap: 0, borderTopWidth: 5, borderTopColor: "#F01818", paddingTop: 50 }, { backgroundColor: currentTheme.primaryBackgroundColor }]}>
                    <View style={{ marginTop: 10, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 30, backgroundColor: "#F01818", position: 'absolute', top: -40 }} >
                        {/* <MaterialIcons name="delete-outline" size={54} color={currentTheme.primaryTextColor} /> */}
                        <AntDesign name="delete" size={34} color="white" />
                    </View>
                    {/* <Text style={[styles.title, { color: currentTheme.primaryTextColor }]}>{title}</Text> */}
                    <Text style={[styles.title, { color: currentTheme.primaryTextColor }]}>{title}?</Text>
                    <Text style={[styles.message, { color: currentTheme.secondaryTextColor }]}>{message}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, { borderWidth: 0.5, borderColor: currentTheme.primaryTextColor }]} onPress={onCancel}>
                            <Text style={[styles.buttonText, { color: currentTheme.primaryTextColor }]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { backgroundColor: "#F01818" }]} onPress={onConfirm}>
                            <Text style={{ color: "white", fontSize: 16, fontWeight: 'bold', }}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>

        </Modal>
    )
}

const styles = StyleSheet.create({
        title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: "center",
        lineHeight: 30,

    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 20
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});


export default CustomConfirmationDialog