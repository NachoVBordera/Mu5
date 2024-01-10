import React from "react";

import { Contact, downloadAvatar } from "../db/post";
import { Text, View } from "./Themed";
import { StyleSheet, TouchableOpacity } from "react-native";
import Avatar from "./Avatar";
interface Props {
  contact: Contact;
  onPressItem: () => void;
}

const ContactItem = ({ contact, onPressItem }: Props) => {
  const [avatartUrl, setAvatarUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!contact) return;
    downloadAvatar(contact.avatar_url!).then(setAvatarUrl);
  }, []);

  return (
    <TouchableOpacity style={styles.container} onPress={onPressItem}>
      <Avatar uri={avatartUrl} size={45}></Avatar>
      <Text style={styles.title}>{contact.user_name}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 16,
    alignItems: "center",
  },
});
export default ContactItem;
