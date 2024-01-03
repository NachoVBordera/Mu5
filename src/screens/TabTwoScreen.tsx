import { StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Button, Text, View } from "../components/Themed";
import { supabase } from "../connection/supabase";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Button title="Cerrar sesion" onPress={() => supabase.auth.signOut} />
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
