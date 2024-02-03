import {
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

import { supabase } from "../connection/supabase";
import AddPostForm from "../components/AddPostForm";
import PostCard from "../components/PostCard";
import { fetchPosts, Posts } from "../services/getAllPost";
import usePosts from "../hooks/usePosts";
import { Loader } from "../components/Loader";
import React from "react";

export default function HomeScreen({ navigation }: RootTabScreenProps<"Home">) {
  const {
    handleSubmit,
    posts,
    setPosts,
    handleDelete,
    isLoading,
    onRefresh,
    setIsLoading,
  } = usePosts();

  React.useEffect(() => {
    fetchPosts().then((data) => {
      setPosts(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        ListHeaderComponent={<AddPostForm onSubmit={handleSubmit} />}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Loader isLoading />}
        renderItem={({ item }) => (
          <PostCard post={item} onDelete={() => handleDelete(item.id)} />
        )}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
