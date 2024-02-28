import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HeaderComponentt from '../components/HeaderComponent'

const ChannelScreen = () => {
  return (
    <View style={{backgroundColor: "#111"}} >
      {/* header  */}
      <HeaderComponentt />
      <Text>ChannelScreen</Text>
    </View>
  )
}

export default ChannelScreen

const styles = StyleSheet.create({})