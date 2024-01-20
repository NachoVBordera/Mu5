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
      <TextInput
        placeholder="What's on your mind?"
        style={styles.input}
        value={content}
        onChangeText={setContent}
      />
      {!!nameError && <Text style={{ color: "red" }}>{nameError}</Text>}

      <Card style={styles.row}>
        <TouchableOpacity onPress={handlerPickImage}>
          <Feather name="image" size={24} color={color} />
        </TouchableOpacity>
        <Button title="Publicar" onPress={handlerPress} />
      </Card>
      {image && (
        <ImageBackground source={{ uri: image }} style={styles.image}>
          <TouchableOpacity onPress={() => setImage("")}>
            <Feather name="x" size={24} color={color} />
          </TouchableOpacity>
        </ImageBackground>
      )}
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
    borderRadius: 8,
    marginBottom: 8,
    color: "white",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    height: 200,
    width: 200,
    alignItems: "flex-end",
    padding: 8,
  },
});
