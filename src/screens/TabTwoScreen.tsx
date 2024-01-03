import { StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";

import { supabase } from "../connection/supabase";
import { useUserInfo } from "../db/userContext";
import { Button, Text, View } from "../components/Themed";

export default function TabTwoScreen() {
  const { profile } = useUserInfo();
  return (
    <View style={styles.container}>
      <Text>{profile?.username}</Text>
      <Button title="Cerrar sesion" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
