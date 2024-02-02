import { Alert, StyleSheet, Text } from "react-native";
import { Avatar, GiftedChat } from "react-native-gifted-chat";
import { RootStackScreenProps } from "../types";
import { Messages, fetchMessages, Message } from "../services/getMessages";
import React from "react";
import { useUserInfo } from "../context/userContext";
import { supabase } from "../connection/supabase";
import { View } from "../components/Themed";

export default function ChatScreen({ route }: RootStackScreenProps<"Chat">) {
  const { contactId } = route.params;
  const [messages, setMessages] = React.useState<Messages>([]);
  const { profile: user } = useUserInfo();

  React.useEffect(() => {
    if (!user) return;
    fetchMessages(user.id, contactId).then(setMessages);

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `sender_id=eq.${contactId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          if (newMessage.receiver_id === user.id) {
            setMessages((prevMessages) => [newMessage, ...prevMessages]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, contactId]);

  const onSend = React.useCallback(async (messages = []) => {
    const [message] = messages;
    const { text } = message;

    const { error, data } = await supabase
      .from("messages")
      .insert({
        sender_id: user?.id || "",
        receiver_id: contactId,
        content: text,
      })
      .select("*");
    if (error) {
      Alert.alert("Server Error", error.message);
    } else {
      setMessages((prevMessages) => [data[0], ...prevMessages]);
    }
  }, []);
  const username = () => {
    messages.map((message) => {
      if (message.sender_id === user?.id) {
        return user?.user_name;
      } else {
        return "Contact";
      }
    });
  };
  return (
    <GiftedChat
      messages={messages.map((message) => ({
        _id: message.id,
        text: message.content,
        createdAt: new Date(message.created_at),
        user: { _id: message.sender_id },
      }))}
      onSend={(messages: any) => onSend(messages)}
      user={{
        _id: user?.id || "",
      }}
      messagesContainerStyle={{ backgroundColor: "#5988B4" }}
    />
  );
}
const styles = StyleSheet.create({});
