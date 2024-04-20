import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  RefreshControl,
  ScrollView,
} from "react-native";
import {
  Alert,
  BackHandler,
  Button,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Post } from "../services/getAllPost";
import Avatar from "./Avatar";
import { useThemeColor } from "./Themed";
import { Profile } from "../models/Profile";
import { useUserInfo } from "../context/userContext";
import { Likes, fetchLikes } from "../services/getLikes";
import { downloadAvatar } from "../services/getAvatar";
import { supabase } from "../connection/supabase";
import { FontAwesome } from "@expo/vector-icons";
import PostOptionModal from "./PostOptionModal";
import ImageDetail from "./ImageDetail";
import { BlurView } from "expo-blur";
import Comment from "./Comment";
import { fetchCommentsById } from "../services/getCommentsById";
import { insertComment } from "../services/postCommenst";
import { FlatList } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Loader } from "./Loader";
interface PostDetailModalProps {
  isVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  post: Post;
  onDelete: () => void;
}

const sixtyFivePercentOfWindowWidth = Dimensions.get("window").height;

const PostDetailModal: React.FC<PostDetailModalProps> = ({
  isVisible,
  setModalVisible,
  post,
  onDelete,
}) => {
  const color = useThemeColor({}, "primary");
  const profile = post.profile as Profile;
  const user = useUserInfo();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [likes, setLikes] = useState<Likes>([]);
  const [isVisebleOptions, setIsVisebleOptions] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const userLikesPost = useMemo(
    () => likes?.find((like) => like.user_id === user?.profile?.id),
    [likes, user]
  );
  const [currentComment, setCurrentComment] = useState("");
  const getLikes = useCallback(
    () => fetchLikes(post.id).then(setLikes),
    [post]
  );
  const [loadingComments, setLoadingComments] = useState(false);
  useEffect(() => {
    getLikes();
    getcommets();
  }, [getLikes]);

  useEffect(() => {
    if (profile?.avatar_url) {
      downloadAvatar(profile.avatar_url).then(setAvatarUrl);
    }
  }, [profile]);

  const getcommets = useCallback(() => {
    setLoadingComments(true);
    fetchCommentsById(post.id).then((data) => {
      setComments(data);
      setLoadingComments(false);
    });
  }, []);

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

  const postNewComment = async () => {
    if (!user.profile) return;
    if (!currentComment) return;
    insertComment(
      currentComment,
      user.profile?.id!,
      post.id,
      user.profile?.user_name!
    );
    setCurrentComment("");
    getcommets();
  };

  return (
    <Modal
      visible={isVisible}
      style={styles.modal}
      onRequestClose={() => {
        setModalVisible(false);
      }}
      transparent={true}
    >
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        enableAutomaticScroll={false}
      >
        <BlurView intensity={100} style={styles.blurContainer}>
          <BlurView intensity={100} style={styles.blurContainer}>
            <View style={styles.container}>
              <View style={styles.header}>
                <Avatar uri={avatarUrl} size={70} />
                <View style={styles.headerContent}>
                  <View style={styles.headerName}>
                    <Text style={styles.username}>{profile.user_name}</Text>
                    {user?.profile?.id === post.user_id && (
                      <TouchableOpacity
                        onPress={() => setIsVisebleOptions(true)}
                      >
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
                <TouchableOpacity
                  style={styles.likeButton}
                  onPress={toggleLike}
                >
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
            </View>
            <View style={styles.commentsSection}>
              <View style={styles.commentsContainer}>
                <View style={styles.commentsContainer}>
                  <ScrollView>
                    {loadingComments ? (
                      <Loader isLoading={loadingComments} size="small" />
                    ) : (
                      comments.map((comment) => <Comment comment={comment} />)
                    )}
                  </ScrollView>
                </View>
              </View>
              <View style={styles.commentsTextInput}>
                <TextInput
                  value={currentComment}
                  placeholder="Escribe un comentario"
                  onChangeText={setCurrentComment}
                />
                <Button
                  title="Enviar"
                  onPress={() => {
                    postNewComment();
                  }}
                />
              </View>
            </View>
          </BlurView>
        </BlurView>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

export default PostDetailModal;

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    height: sixtyFivePercentOfWindowWidth,
    overflow: "scroll",
  },

  container: {
    backgroundColor: "#fff",
    marginVertical: 8,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    height: sixtyFivePercentOfWindowWidth * 0.34,
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
  commentsSection: {
    justifyContent: "space-between",
    height: "60%",
  },
  commentsContainer: {
    height: sixtyFivePercentOfWindowWidth * 0.55,
    overflow: "scroll",
  },
  titleComment: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  commentsTextInput: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 8,
    marginVertical: 8,
    marginHorizontal: 8,
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    height: sixtyFivePercentOfWindowWidth * 0.07,
  },
});
