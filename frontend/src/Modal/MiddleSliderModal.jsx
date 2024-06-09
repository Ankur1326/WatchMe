import { Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { BottomModal, ModalContent, SlideAnimation } from 'react-native-modals';

const MiddleSliderModal = ({ children, isVisible, setVisible }) => {
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
            style={{  }}
            height={"80%"}
            onSwipeOut={() => setVisible(!isVisible)}

        >
            <ModalContent style={{ paddingHorizontal: 10, paddingVertical: 0, backgroundColor: "#222", alignItems: 'center', width: "100%", alignSelf: 'center', height: "100%", }}>
                {children}
            </ModalContent>
        </BottomModal>
    )
}

export default MiddleSliderModal