import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Button, Text, TextInput, View } from "./Themed";
import { Profile } from "../models/Profile";
import Avatar from "./Avatar";
import * as ImagePicker from "expo-image-picker";
import { downloadAvatar } from "../services/getAvatar";

interface ProfileFormProps {
  profile: Profile | null;
  onSave: (updatedProfile: Profile, avatarUpdated: Boolean) => void;
  onLogout: () => void;
  loading: boolean;
}

export default function ProfileForm({
  profile,
  onSave,
  loading,
  onLogout,
}: ProfileFormProps) {
  const [username, setUsername] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [avatarUpdated, setAvatarUpdated] = useState(false);

  useEffect(() => {
    if (profile?.user_name) {
      setUsername(profile.user_name);
    }
    if (profile?.avatar_url) {
      downloadAvatar(profile.avatar_url).then(setImageUri);
    }
  }, [profile]);

  const handleSubmit = () => {
    if (profile) {
      onSave(
        { ...profile, user_name: username, avatar_url: imageUri },
        avatarUpdated
      );
    }
  };

  const handlerPickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setAvatarUpdated(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.input}>
              <TouchableOpacity
                style={styles.avatarbutton}
                onPress={handlerPickImage}
              >
                <Avatar uri={imageUri} size={120} />
              </TouchableOpacity>
              <TextInput
                style={styles.inputName}
                placeholder="Nombre de usuario"
                value={username}
                onChangeText={setUsername}
              />
            </View>

            <View style={styles.input}>
              <Button
                title="Guardar cambios"
                onPress={handleSubmit}
                disabled={loading || !username}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginVertical: 8,
    marginHorizontal: 8,
  },
  inner: {
    padding: 16,
    flex: 1,
  },
  input: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 8,
  },
  avatarbutton: {
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 4,
    borderColor: "black",
  },
  inputName: {
    padding: 10,
    borderRadius: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
});
