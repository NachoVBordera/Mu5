import { supabase } from "../connection/supabase";

export const getReceiverAvatarUrl = async (contactId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", contactId);
  if (error) {
    console.error("error", error.message);
    return null;
  } else {
    return data![0].avatar_url;
  }
};
