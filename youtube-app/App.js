import { StatusBar, StyleSheet, Text, View } from "react-native";
import StackNavigation from "./navigations/StackNavigation";
import { UserContext } from "./UserContext";

export default function App() {
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
