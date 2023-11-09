import { useContext } from "react";
import { Nav } from "./components/Nav";
import { SupabaseContext } from "./context/SupabaseContext";
import { AuthenticateModal } from "./components/AuthenticateModal";
import { Leaderboard } from "./components/leaderboard/Leaderboard";
import { CircularProgress } from "@nextui-org/react";

function App() {
  const { session, supabase } = useContext(SupabaseContext)!;

  if (!supabase) {
    return <CircularProgress label="Loading..." />;
  }

  return (
    <>
      {!session && <AuthenticateModal session={session} />}
      <Nav />
      <Leaderboard />
    </>
  );
}

export default App;
