import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Button, TextInput, Card, useThemeColor, Text } from "./Themed";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
interface AddPostFormProps {
  onSubmit: (content: string, image: string) => void;
}
export default function AddPostForm({ onSubmit }: AddPostFormProps) {
  const [content, setContent] = React.useState("");
  const [image, setImage] = React.useState<string | null>(null);
  const [nameError, setNameError] = React.useState<string | null>(null);

  const color = useThemeColor({}, "primary");

  const handlerPickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlerPress = () => {
    if (content.trim() === "") {
      setNameError("Content is required");
    } else {
      setNameError(null);
      onSubmit(content, image!);
      setContent("");
      setImage("");
    }
  };
  return (
    <Card style={styles.container}>
      <Card style={styles.containerInput}>
        <TextInput
          placeholder="What's on your mind?"
          style={styles.input}
          value={content}
          onChangeText={setContent}
        />
        <TouchableOpacity
          style={styles.containerImage}
          onPress={handlerPickImage}
        >
          <Feather name="camera" size={20} color={color} />
        </TouchableOpacity>
        {image && (
          <ImageBackground source={{ uri: image }} style={styles.image}>
            <TouchableOpacity onPress={() => setImage("")}>
              <Feather name="x" size={24} color={color} />
            </TouchableOpacity>
          </ImageBackground>
        )}
      </Card>
      {!!nameError && <Text style={{ color: "red" }}>{nameError}</Text>}
      <Card style={styles.row}>
        <Button title="Publicar" onPress={handlerPress} />
      </Card>
    </Card>
  );
}
const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    padding: 16,
    color: "white",
  },

  input: {
    padding: 8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    marginBottom: 8,
    color: "white",
    flex: 1,
    backgroundColor: "#C2C6D3",
  },

  row: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  image: {
    height: 200,
    width: 200,
    alignItems: "flex-end",
    padding: 8,
  },

  containerInput: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },

  containerImage: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#C2C6D3",
    borderWidth: 1,
    borderColor: "gray",
    width: 45,
    height: 45,
  },
});
