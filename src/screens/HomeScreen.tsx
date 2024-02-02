import { Alert, FlatList, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import React from "react";
import { supabase } from "../connection/supabase";
import AddPostForm from "../components/AddPostForm";
import PostCard from "../components/PostCard";
import { fetchPosts, Posts } from "../services/getAllPost";
import usePosts from "../hooks/usePosts";

export default function HomeScreen({ navigation }: RootTabScreenProps<"Home">) {
  const { handleSubmit, posts, setPosts, handleDelete } = usePosts();

  React.useEffect(() => {
    fetchPosts().then((data) => setPosts(data));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        ListHeaderComponent={<AddPostForm onSubmit={handleSubmit} />}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={({ item }) => (
          <PostCard post={item} onDelete={() => handleDelete(item.id)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
