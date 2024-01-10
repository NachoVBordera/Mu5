import { Alert, StyleSheet } from "react-native";
import { supabase } from "../connection/supabase";
import { useUserInfo } from "../db/userContext";
import ProfileForm from "../components/ProfileForm";
import { Profile } from "../typesModel/Profile";
import React from "react";

export default function TabTwoScreen() {
  const { profile, editProfile, loading } = useUserInfo();

  return (
    <ProfileForm
      profile={profile}
      loading={loading!}
      onSave={editProfile!}
      onLogout={() => supabase.auth.signOut()}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
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
