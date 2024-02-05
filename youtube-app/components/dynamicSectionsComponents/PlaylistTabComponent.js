import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'

const PlaylistTabComponent = () => {
  useEffect(() => {
    console.log("Profile component is rendered");
  }, [])
  
  return (
    <View style={{height: 300, backgroundColor: "red"}}>
      <Text style={{color: "black"}}>PlaylistTabComponent</Text>
    </View>
  )
}

export default PlaylistTabComponent

const styles = StyleSheet.create({})