import { supabase } from "../connection/supabase";

export const fetchMessages = async (userId: string, contactId: string) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .or(`sender_id.eq.${contactId},receiver_id.eq.${contactId}`)
    .order("created_at", { ascending: false });
  if (error) {
    console.log("error", error.message);
    return [];
  } else {
    return data;
  }
};

export type Messages = Awaited<ReturnType<typeof fetchMessages>>;
export type Message = Messages[number];
