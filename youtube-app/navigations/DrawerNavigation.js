import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Sidebar from './Sidebar';
import BottomTabNavigation from './BottomTabNavigation';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
    return (
        <Drawer.Navigator drawerContent={props => <Sidebar {...props} />}>
            <Drawer.Screen name="BottomTab" component={BottomTabNavigation} options={{headerShown: false}} />
        </Drawer.Navigator>
    );
}

export default DrawerNavigation