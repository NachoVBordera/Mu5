import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useUserInfo } from "../context/userContext";
import ContactItem from "../components/ContactItem";
import { RootTabScreenProps } from "../types";
import { Contact, Contacts, fetchContacts } from "../services/getContacts";
import { Card } from "../components/Themed";

const ContactsScreen = ({ navigation }: RootTabScreenProps<"Contacts">) => {
  const [contacts, setContacts] = React.useState<Contacts>([]);
  const { profile } = useUserInfo();
  React.useEffect(() => {
    if (!profile) return;
    fetchContacts(profile.id).then(setContacts);
  }, []);
  const handleContactOnPress = (contact: Contact) => {
    navigation.navigate("Chat", {
      contactId: contact.id,
      username: contact.user_name!,
    });
  };
  return (
    <FlatList
      data={contacts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Card style={styles.contactItem}>
          {
            <ContactItem
              contact={item}
              onPressItem={() => handleContactOnPress(item)}
            />
          }
        </Card>
      )}
    />
  );
};
const styles = StyleSheet.create({
  contactItem: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
});
export default ContactsScreen;
