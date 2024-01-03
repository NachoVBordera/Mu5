import { Session } from "@supabase/supabase-js";
import React, { createContext, useState } from "react";
import { supabase } from "../connection/supabase";

export interface UserProfile {
  userneame: string;
  avatarUrl?: string;
}
export interface UserInfo {
  session: Session | null;
  profile: UserProfile | null;
}

export const UserContext = createContext<UserInfo>({
  session: null,
  profile: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    session: null,
    profile: null,
  });
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserInfo({ ...userInfo, session });
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUserInfo({ ...userInfo, session });
    });
  }, []);

  return (
    <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>
  );
}

export function useUserInfo() {
  return React.useContext(UserContext);
}
