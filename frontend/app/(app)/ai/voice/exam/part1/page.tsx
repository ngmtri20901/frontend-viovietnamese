import { redirect } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/server";
import { Part1SetupClient } from "./Part1SetupClient";

export default async function Part1SetupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("name")
    .eq("id", user.id)
    .single();

  const userName = profile?.name || user.email?.split("@")[0] || "User";
  const userId = user.id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Part1SetupClient userName={userName} userId={userId} />
      </div>
    </div>
  );
}
