import { createContext, useState, useEffect, ReactNode } from "react";
import {
  createClient,
  User,
  Session,
  SupabaseClient,
} from "@supabase/supabase-js";
import { toast } from "react-toastify";

interface SupabaseContextValue {
  user: User | null;
  session: Session | null;
  supabase: SupabaseClient | null;
  painfullyWithdraw: () => {};
  notifyTheCord: () => void;
}

interface SupabaseProviderProps {
  children: ReactNode;
}

export const SupabaseContext = createContext<SupabaseContextValue | null>(null);

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("supabaseUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      const currentUser = session?.user || null;

      if (currentUser !== user) {
        setUser(currentUser);

        if (currentUser) {
          localStorage.setItem("supabaseUser", JSON.stringify(currentUser));
        } else {
          localStorage.removeItem("supabaseUser");
        }
      }

      if (_event === "SIGNED_IN" && session?.user?.aud === "authenticated") {
        await supabase.from("user_status").insert([
          {
            id: session.user.id,
            stillgoing: true,
            username: currentUser?.user_metadata?.full_name,
          },
        ]);

        window.location.reload();

        toast.success("You were successfully authenticated!");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const painfullyWithdraw = async () => {
    console.log(user?.id);
    const { error } = await supabase
      .from("user_status")
      .update({ stillgoing: false })
      .eq("id", user?.id);

    if (!error) {
      toast.warn("You've withdrawn from the struggle.");
    }

    window.location.reload();
  };

  const notifyTheCord = () => {
    fetch(import.meta.env.VITE_DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "God",
        content: `${user?.user_metadata?.full_name}, just mega folded.`,
      }),
    });
  };

  const contextValue = {
    user,
    session,
    supabase,
    painfullyWithdraw,
    notifyTheCord,
  };

  return (
    <SupabaseContext.Provider value={contextValue}>
      {children}
    </SupabaseContext.Provider>
  );
};
