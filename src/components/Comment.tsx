import React, { useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { downloadAvatar } from "../services/getAvatar";
import { Comment as CommentProp } from "../services/getAllPost";
import Avatar from "./Avatar";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getAvatarUrl } from "../services/getReceiverAvatarUrl";

interface CommentProps {
  comment: CommentProp;
}
//getAvatarByUserId

const halfOfWindowWidth = Dimensions.get("window").width * 0.68;

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const [avatarUrl, setAvatarUrl] = React.useState("");
  const [image, setImage] = React.useState("");
  useEffect(() => {
    getAvatarUrl(comment.user_id).then(setAvatarUrl);
    if (avatarUrl) {
      console.log(avatarUrl);
      downloadAvatar(avatarUrl).then(setImage);
    }
  }, [avatarUrl]);

  return (
    <View style={styles.container}>
      <Avatar size={64} uri={image} />
      <View style={styles.header}>
        <Text style={styles.userName}>{comment.user_name}</Text>
        <Text style={styles.text}>{comment.comment}</Text>
      </View>
    </View>
  );
};

export default Comment;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#fff",
    padding: 8,
    marginVertical: 8,
    marginHorizontal: 8,
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  text: {
    fontSize: 12,
    textAlign: "left",
    width: halfOfWindowWidth,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
