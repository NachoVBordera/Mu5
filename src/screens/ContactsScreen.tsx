import React from "react";
import { View, Text, FlatList } from "react-native";
import { useUserInfo } from "../context/userContext";
import ContactItem from "../components/ContactItem";
import { RootTabScreenProps } from "../types";
import { Contact, Contacts, fetchContacts } from "../services/getContacts";

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
        <Text>
          {
            <ContactItem
              contact={item}
              onPressItem={() => handleContactOnPress(item)}
            />
          }
        </Text>
      )}
    />
  );
};

export default ContactsScreen;
