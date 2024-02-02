import { Alert, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { supabase } from "../connection/supabase";
import { useUserInfo } from "../context/userContext";
import ProfileForm from "../components/ProfileForm";
import { Profile } from "../models/Profile";
import React from "react";
import { fetchPostsByUser } from "../services/getPostsByUser";
import { View } from "../components/Themed";
import AddPostForm from "../components/AddPostForm";
import usePosts from "../hooks/usePosts";
import PostCard from "../components/PostCard";
import { SignOutButton } from "../components/SingOutBotton";

export default function TabTwoScreen() {
  const { profile, editProfile, loading } = useUserInfo();
  const [posts, setPosts] = React.useState<Profile[] | any>(null);
  const { handleSubmit, handleDelete } = usePosts();

  React.useEffect(() => {
    if (!loading) {
      fetchPostsByUser(profile?.id!).then((data) => setPosts(data));
    }
  }, [profile, loading]);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        ListHeaderComponent={
          <ProfileForm
            profile={profile}
            loading={loading!}
            onSave={editProfile!}
            onLogout={() => supabase.auth.signOut()}
          />
        }
        ListFooterComponent={
          <SignOutButton
            onLogout={() => supabase.auth.signOut()}
            label="Cerrar Sesión"
          />
        }
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostCard post={item} onDelete={() => handleDelete(item.id)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
