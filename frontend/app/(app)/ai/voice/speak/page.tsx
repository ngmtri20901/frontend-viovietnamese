import Agent from "@/features/ai/voice/components/Agent";
import { createClient } from "@/shared/lib/supabase/server";

const Page = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get user profile name
  const userName = user?.email?.split("@")[0] || "User";

  return (
    <>
      <h3>Vietnamese Conversation Practice</h3>

      <Agent
        userName={userName}
        userId={user?.id ?? ""}
        type="practice"
      />
    </>
  );
};

export default Page;
