import React from "react";
import { View, Text } from "react-native";
import AuthForm from "../components/AuthForm";
import {
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from "@supabase/supabase-js";
import { supabase } from "../connection/supabase";

const AuthScreen = () => {
  const [loading, setLoading] = React.useState(false);
  const handleSignUp = async (credentials: SignUpWithPasswordCredentials) => {
    if (!("email" in credentials)) return;
    setLoading(true);
    const { email, password } = credentials;
    const { error, data } = await supabase.auth.signUp({ email, password });
  };
  const handleLogin = async (credentials: SignInWithPasswordCredentials) => {
    if (!("email" in credentials)) return;
    setLoading(true);
    const { email, password } = credentials;
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };
  return (
    <AuthForm loading={loading} onLogin={handleLogin} onSignUp={handleSignUp} />
  );
};

export default AuthScreen;
