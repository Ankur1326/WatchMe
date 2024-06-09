import { Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { BottomModal, ModalContent, SlideAnimation } from 'react-native-modals';


const BottomSlideModal = ({ children, isVisible, setVisible }) => {

    return (
        <BottomModal onBackdropPress={() => setVisible(!isVisible)}
            swipeDirection={["up", "down"]}
            swipeThreshold={200}
            modalAnimation={
                new SlideAnimation({
                    slideFrom: "bottom"
                })
            }
            onHardwareBackPress={() => setVisible(!isVisible)}
            onTouchOutside={() => setVisible(!isVisible)}
            visible={isVisible}
            style={{ paddingHorizontal: 50, }}
            onSwipeOut={() => setVisible(!isVisible)}

        >
            <ModalContent style={{ paddingHorizontal: 0, backgroundColor: "#222", alignItems: 'flex-end', justifyContent: 'flex-end', width: "100%", alignSelf: 'center', }}>
                {children}
            </ModalContent>
        </BottomModal>
    )
}

export default BottomSlideModal