import 'react-native-gesture-handler';
import { Image, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import StackNavigation, { MenuDrawer } from "./navigations/StackNavigation";
import { UserContext } from "./UserContext";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigation from './navigations/DrawerNavigation';
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function App() {
  // const navigation = useNavigation()
  return (
    <>
      <UserContext>
        <StatusBar barStyle="light-content" />
          <StackNavigation />
      </UserContext>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
