import { Alert, StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { RootStackScreenProps } from "../types";
import { Messages, fetchMessages, Message } from "../db/post";
import React from "react";
import { useUserInfo } from "../db/userContext";
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
    />
  );
}
const styles = StyleSheet.create({});
