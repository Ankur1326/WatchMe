import { Modal, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import React from 'react'
import { useTheme } from 'expo-theme-switcher';

const ErrorAlertDialog = ({ visible, title, message, onClose }) => {
    const { currentTheme } = useTheme()
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.dialogBox, {backgroundColor: currentTheme.secondaryBackgroundColor}]}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={[styles.message, {color: currentTheme.primaryTextColor}]}>{message}</Text>
                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default ErrorAlertDialog

const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dialogBox: {
      width: '80%',
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#d9534f',
      marginBottom: 10,
      textAlign: 'center',
    },
    message: {
      fontSize: 16,
      color: '#333',
      marginBottom: 20,
      textAlign: 'center',
    },
    button: {
      backgroundColor: '#d9534f',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
  });