import {
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  BackHandler,
} from "react-native";
import { useThemeColor } from "./Themed";
import { FontAwesome } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import Avatar from "./Avatar";
import { Profile } from "../models/Profile";
import { useUserInfo } from "../context/userContext";
import { supabase } from "../connection/supabase";
import { Post } from "../services/getAllPost";
import { Likes, fetchLikes } from "../services/getLikes";
import { downloadAvatar } from "../services/getAvatar";
import ImageDetail from "./ImageDetail";
import PostOptionModal from "./PostOptionModal";
import PostDetailModal from "./PostDetailModal";


interface Props {
  post: Post;
  onDelete: () => void;
}

export default function PostCard({ post, onDelete }: Props) {
  const color = useThemeColor({}, "primary");
  const profile = post.profile as Profile;
  const user = useUserInfo();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [likes, setLikes] = useState<Likes>([]);
  const [isVisebleOptions, setIsVisebleOptions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const userLikesPost = useMemo(
    () => likes?.find((like) => like.user_id === user?.profile?.id),
    [likes, user]
  );

  const getLikes = useCallback(
    () => fetchLikes(post.id).then(setLikes),
    [post]
  );

  useEffect(() => {
    getLikes();
  }, [getLikes]);

  useEffect(() => {
    if (profile?.avatar_url) {
      downloadAvatar(profile.avatar_url).then(setAvatarUrl);
    }
  }, [profile]);

  const toggleLike = async () => {
    if (!user.profile) return;
    if (userLikesPost) {
      const { error } = await supabase
        .from("post_likes")
        .delete()
        .eq("id", userLikesPost.id);
      if (error) Alert.alert("Server Error", error.message);
    } else {
      const { error } = await supabase.from("post_likes").insert({
        post_id: post.id,
        user_id: user?.profile?.id,
      });
      if (error) Alert.alert("Server Error", error.message);
    }
    getLikes();
  };
  useEffect(() => {
    const backAction = () => {
      console.log("isModalVisible", isModalVisible);

      if (isModalVisible) {
        setIsModalVisible(false);
        return true;
      }
      return false; // Si el modal no está visible, no hacemos nada y permitimos la acción por defecto.
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [isModalVisible, setIsModalVisible]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setIsModalVisible(true)}
    >
      <View style={styles.header}>
        <Avatar uri={avatarUrl} size={70} />
        <View style={styles.headerContent}>
          <View style={styles.headerName}>
            <Text style={styles.username}>{profile.user_name}</Text>
            {user?.profile?.id === post.user_id && (
              <TouchableOpacity onPress={() => setIsVisebleOptions(true)}>
                <FontAwesome
                  style={styles.delete}
                  name="ellipsis-h"
                  size={30}
                  color={color}
                />
                <PostOptionModal
                  setIsVisebleOptions={setIsVisebleOptions}
                  isVisebleOptions={isVisebleOptions}
                  onDelete={onDelete}
                />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.contentText}>{post.content}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {post.image && (
          <View style={styles.imageContainer}>
            <ImageDetail image={post.image} />
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.likeButton} onPress={toggleLike}>
          {userLikesPost ? (
            <Image
              style={styles.likeImg}
              source={require("../assets/images/iconLike.png")}
            />
          ) : (
            <Image
              style={styles.likeImg}
              source={require("../assets/images/iconlikeDis.png")}
            />
          )}
          <Text style={styles.textLike}>{likes.length}</Text>
        </TouchableOpacity>
      </View>
      <PostDetailModal
        isVisible={isModalVisible}
        post={post}
        setModalVisible={setIsModalVisible}
        onDelete={() => {}}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginVertical: 8,
    marginHorizontal: 8,
    borderBottomWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerName: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    width: "100%",
  },

  username: {
    fontWeight: "bold",
    fontSize: 20,

    color: "#000",
  },
  imageContainer: {
    width: 100,
    height: 100,
    margin: 8,
    alignSelf: "flex-end",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  content: {
    alignContent: "space-between",
    padding: 16,
    marginLeft: 8,
    marginRight: 8,
  },
  contentText: {
    fontSize: 16,
  },
  footer: {
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  delete: {
    width: 30,
    height: 30,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeImg: {
    width: 40,
    height: 40,
  },
  textLike: {
    marginLeft: 2,
  },
});
