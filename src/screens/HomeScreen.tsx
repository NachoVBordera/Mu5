import { Alert, FlatList, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import React from "react";
import { supabase } from "../connection/supabase";
import AddPostForm from "../components/AddPostForm";
import { Posts, fetchPosts } from "../db/post";
import PostCard from "../components/PostCard";

export default function HomeScreen({ navigation }: RootTabScreenProps<"Home">) {
  const [posts, setPosts] = React.useState<Posts>([]);

  React.useEffect(() => {
    fetchPosts().then((data) => setPosts(data));
  }, []);

  const handleSubmit = async (content: string) => {
    const { data, error } = await supabase
      .from("posts")
      .insert({ content })
      .select();
    if (error) {
      console.log(error);
      Alert.alert(error.message);
    } else {
      setPosts([data[0], ...posts]);
    }
  };
  return (
    <View style={styles.container}>
      <AddPostForm onSubmit={handleSubmit} />
      <FlatList
        data={posts}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={({ item }) => <PostCard post={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
