import { StyleSheet, View, ActivityIndicator, Text } from "react-native";

interface Props {
  isLoading: boolean;
  withText?: boolean;
}

export const Loader = ({ isLoading = false, withText = false }: Props) => {
  return isLoading ? (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color="#aaaaaa" />
      {withText ? (
        <Text style={{ color: "green" }}>Loading users...</Text>
      ) : null}
    </View>
  ) : null;
};
const styles = StyleSheet.create({
  loader: {
    marginVertical: 15,
    alignItems: "center",
  },
});
