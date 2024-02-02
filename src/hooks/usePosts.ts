import React from "react";
import { Posts } from "../services/getAllPost";
import { supabase } from "../connection/supabase";
import { Alert } from "react-native";
import { useUserInfo } from "../context/userContext";

export default function usePosts() {
  const { profile } = useUserInfo();

  const [posts, setPosts] = React.useState<Posts>([]);

  const handleDelete = async (id: String) => {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      console.log(error);
      Alert.alert(error.message);
    } else {
      setPosts(posts.filter((post) => post.id !== id));
    }
  };
  const handleSubmit = async (content: string, image: string) => {
    try {
      let publicUrl = "";

      if (image) {
        const fileExt = image.split(".").pop();
        const fileName = image.replace(/^.*[\\\/]/, "");
        const filePath = `${Date.now()}.${fileExt}`;

        const formData = new FormData();
        const photo = {
          uri: image,
          name: fileName,
          type: `image/${fileExt}`,
        } as unknown as Blob;
        formData.append("file", photo);

        const { error } = await supabase.storage
          .from("posts")
          .upload(filePath, formData);
        if (error) throw error;

        const { data } = supabase.storage.from("posts").getPublicUrl(filePath);
        publicUrl = data.publicUrl;
      }

      const { data, error } = await supabase
        .from("posts")
        .insert({ content, image: publicUrl })
        .select("*, profile: profiles(user_name, avatar_url)");
      if (error) {
        throw error;
      } else {
        setPosts([data[0], ...posts]);
      }
    } catch (error: any) {
      Alert.alert("Server Error", error.message);
    }
  };

  return { posts, setPosts, handleSubmit, handleDelete };
}
