import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Button, TextInput, Card, useThemeColor } from "./Themed";
import { Feather } from "@expo/vector-icons";
interface AddPostFormProps {
  onSubmit: (content: string) => void;
}
export default function AddPostForm({ onSubmit }: AddPostFormProps) {
  const [content, setContent] = React.useState("");
  const color = useThemeColor({}, "primary");

  return (
    <Card style={styles.container}>
      <TextInput
        placeholder="What's on your mind?"
        style={styles.input}
        value={content}
        onChangeText={setContent}
      />

      <Card style={styles.row}>
        <TouchableOpacity>
          <Feather name="image" size={24} color={color} />
        </TouchableOpacity>
        <Button
          title="Publicar"
          onPress={() => {
            onSubmit(content);
            setContent("");
          }}
        />
      </Card>
    </Card>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 16,
    color: "white",
  },
  input: {
    padding: 8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    marginBottom: 8,
    color: "white",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
