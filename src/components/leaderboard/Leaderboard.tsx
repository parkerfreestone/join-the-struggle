import { useEffect, useState, useContext } from "react";
import {
  Avatar,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { LeaderboardHeader } from "./LeaderboardHeader";
import { SupabaseContext } from "../../context/SupabaseContext";

export interface LeaderboardRowItem {
  stillgoing: boolean;
  username: string;
  nut_count: number;
}

const formatUsername = (username: string) => {
  if (!username) return "";
  const withoutDot = username.startsWith(".")
    ? username.substring(1)
    : username;
  const capitalized = withoutDot.charAt(0).toUpperCase() + withoutDot.slice(1);
  return capitalized;
};

export const Leaderboard = () => {
  const [users, setUsers] = useState<LeaderboardRowItem[] | null>(null);
  const { supabase } = useContext(SupabaseContext)!;

  if (!supabase) {
    return <CircularProgress label="Loading..." />;
  }

  const fetchUsers = async () => {
    const { data } = await supabase
      .from("user_status")
      .select("username, stillgoing, nut_count");
    setUsers(data);
  };

  useEffect(() => {
    const subscription = supabase
      .channel("user_status")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_status",
        },
        fetchUsers
      )
      .subscribe();

    fetchUsers();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!users) {
    return <CircularProgress label="Loading..." />;
  }

  return (
    <div className="max-w-5xl px-8 mt-12 mx-auto">
      <LeaderboardHeader />
      <div className="mt-4">
        <Table isStriped shadow="sm" fullWidth>
          <TableHeader>
            <TableColumn key="username">USERNAME</TableColumn>
            <TableColumn key="nut_count">NUT COUNT</TableColumn>
            <TableColumn key="stillgoing">STATUS</TableColumn>
          </TableHeader>
          <TableBody items={users} emptyContent="No one joined :(">
            {(item) => (
              <TableRow key={item.username}>
                <TableCell className="font-bold">
                  <div className="flex items-center justify-start gap-4">
                    <div className="hidden md:flex">
                      <Avatar
                        isBordered
                        size="md"
                        name={formatUsername(item.username)[0]}
                        color={item.stillgoing ? "primary" : "danger"}
                      />
                    </div>
                    <p>{item.username}</p>
                  </div>
                </TableCell>
                <TableCell className="font-bold">
                  {item.nut_count === 0 ? (
                    <Chip color="success" variant="faded">
                      {item.nut_count}
                    </Chip>
                  ) : (
                    <Chip color="danger" variant="faded">
                      {item.nut_count}
                    </Chip>
                  )}
                </TableCell>
                <TableCell>
                  {item.stillgoing ? (
                    <Chip size="md" color="primary" variant="shadow">
                      Still Going
                    </Chip>
                  ) : (
                    <Chip size="md" color="danger" variant="shadow">
                      Withdrawn
                    </Chip>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
