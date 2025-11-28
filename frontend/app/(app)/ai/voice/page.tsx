import { createClient } from "@/shared/lib/supabase/server";
import { getConversationsByUser } from "@/features/ai/voice/actions/voice.action";
import { VoiceChatClient } from "@/features/ai/voice/components/VoiceChatClient";
import { ConversationsList } from "@/features/ai/voice/components/ConversationsList";

async function VoiceChatHome() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get user profile for name
  let userName = "User";
  let userId = "";
  if (user) {
    userId = user.id;
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("name")
      .eq("id", user.id)
      .single();
    userName = profile?.name || user.email?.split("@")[0] || "User";
  }

  // Get user's conversations
  const userConversations = user
    ? await getConversationsByUser({ userId: user.id, limit: 10 })
    : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-sm font-bold text-gray-600">My Workspace</h1>
        <h2 className="text-3xl font-bold">Welcome back, {userName}</h2>
      </div>

      {/* Client Component for Dialogs */}
      <VoiceChatClient userName={userName} userId={userId} />

      {/* Recent Conversations - Unified Section */}
      <ConversationsList conversations={userConversations} />
    </div>
  );
}

export default VoiceChatHome;
