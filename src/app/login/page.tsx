import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Login flow: users who already have a valid Supabase session skip the
  // credential form and land directly in the protected dashboard.
  if (user) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
