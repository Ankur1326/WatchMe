import { View, Text } from 'react-native'
import React from 'react'

const PopupMessage = ({ showMessage, setShowMessage, isError }) => {
    // if isError false so this message for success

    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={isShowErrormessage}
        // visible={true}
        >
            <View style={{ flex: 1, justifyContent: 'center', width: "100%", }}>

                <View style={{ backgroundColor: "#F65B5B", alignSelf: 'center', marginTop: 50, width: "90%", height: 45, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }} >
                        <MaterialIcons name="error-outline" size={24} color="white" fontWeight="200" />
                        <Text style={{ fontSize: 14, color: "white" }} >Video is already added in this playlist</Text>
                    </View>

                    <TouchableOpacity onPress={() => { setShowErrormessage(false) }} style={{}}>
                        <Entypo name="cross" size={28} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default PopupMessage