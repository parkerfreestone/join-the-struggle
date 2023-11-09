import { ReactNode, useContext, useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Switch,
  CircularProgress,
} from "@nextui-org/react";
import { Flag, Milk, MilkOff, Moon, Sun, User, X } from "lucide-react";
import { SupabaseContext } from "../context/SupabaseContext";
import { WithdrawModal } from "./WithdrawModal";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

export const Nav = () => {
  const [stillGoing, setStillGoing] = useState<boolean | null>(null);
  const [nutCount, setNutCount] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, supabase, notifyTheCord } = useContext(SupabaseContext)!;
  const { isDarkMode, toggleDarkMode } = useTheme();

  if (!supabase) {
    return <CircularProgress label="Loading..." />;
  }

  const updateNutCount = async () => {
    const { error, data } = await supabase
      .from("user_status")
      .select("last_nut")
      .eq("id", user?.id)
      .single();

    if (error) {
      toast.error("There was a problem fetching user data.");
    }

    const now = new Date();
    const twentySecondsAgo = new Date(now.getTime() - 20 * 1000).toISOString();

    if (data?.last_nut < twentySecondsAgo || !data?.last_nut) {
      const { error } = await supabase
        .from("user_status")
        .update({ nut_count: nutCount + 1 || 0, last_nut: now.toISOString() })
        .eq("id", user?.id);

      if (error) {
        toast.error(
          `There was an error updating your nut count :( ${error.message}`
        );
      } else {
        setNutCount(nutCount + 1);
        toast.success(`Nut Count Updated to: ${nutCount + 1}`);

        notifyTheCord();
      }
    } else {
      toast.warn("Slow down cowboy 🤠");
    }
  };

  type NavDropdownItemType = {
    key: string;
    label: string;
    icon: ReactNode;
    onPress: () => void;
  };

  const stillInDropdownItems: NavDropdownItemType[] = [
    {
      key: "withdraw",
      label: "Withdraw",
      icon: <Flag className="h-4 w-4" />,
      onPress: onOpen,
    },
  ];

  const withdrawnDropdownItems: NavDropdownItemType[] = [
    {
      key: "add-one",
      label: "Add 1 to Nut Count",
      icon: <Milk className="h-4 w-4" />,
      onPress: updateNutCount,
    },
    {
      key: "youve-withdrawn",
      label: "You've withdrawn this year",
      icon: <Milk className="h-4 w-4" />,
      onPress: () => toast.info("Better luck next year champ."),
    },
  ];

  const renderDropdownItem = (item: any) => {
    const typedItem = item as NavDropdownItemType;

    return (
      <DropdownItem
        key={typedItem.key}
        startContent={typedItem.icon}
        color={stillGoing ? "danger" : "primary"}
        onPress={typedItem.onPress}
      >
        {typedItem?.label}
      </DropdownItem>
    );
  };

  useEffect(() => {
    const fetchUserStatus = async () => {
      const { data, error } = await supabase
        .from("user_status")
        .select("stillgoing, nut_count")
        .eq("id", user?.id);

      if (error) {
        console.error("Error fetching user status:", error);
      } else if (data && data.length > 0) {
        setStillGoing(data[0].stillgoing);
        setNutCount(data[0].nut_count);
      }
    };

    fetchUserStatus();
  }, []);

  return (
    <>
      <Navbar isBlurred className="px-0">
        <NavbarContent>
          <NavbarBrand>
            <MilkOff />
            <p className="font-bold text-inherit">THE STRUGGLE</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <Switch
              size="lg"
              color="primary"
              isSelected={isDarkMode}
              onValueChange={toggleDarkMode}
              thumbIcon={({ isSelected, className }) =>
                isSelected ? (
                  <Sun className={`${className} p-1`} />
                ) : (
                  <Moon className={`${className} p-1`} />
                )
              }
            />
          </NavbarItem>
          <NavbarItem className="hidden lg:flex"></NavbarItem>
          {stillGoing ? (
            <NavbarItem className="hidden lg:flex">
              <Button color="danger" variant="shadow" onPress={onOpen}>
                <Flag className="w-4 h-4" />
                Withdraw
              </Button>
            </NavbarItem>
          ) : (
            <>
              <NavbarItem className="hidden lg:flex">
                <Button
                  color="primary"
                  variant="bordered"
                  onPress={updateNutCount}
                >
                  <Milk className="w-4 h-4" />
                  Add 1 to Nut Count
                </Button>
              </NavbarItem>
              <NavbarItem className="hidden lg:flex">
                <Button
                  color="primary"
                  variant="bordered"
                  onPress={() => toast.info("Better luck next year champ.")}
                >
                  <X className="w-4 h-4" />
                  You've Withdrawn This Year
                </Button>
              </NavbarItem>
            </>
          )}

          <Button
            color="primary"
            variant="bordered"
            disabled
            className="hidden lg:flex"
          >
            <User className="h-4 w-4" />
            {user?.user_metadata?.full_name}
          </Button>

          <Dropdown isDisabled>
            <DropdownTrigger disabled className="flex lg:hidden">
              <Button color="primary" variant="bordered" disabled>
                <User className="h-4 w-4" />
                {user?.user_metadata?.full_name}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="nav dropdown"
              items={stillGoing ? stillInDropdownItems : withdrawnDropdownItems}
            >
              {renderDropdownItem}
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>
      <WithdrawModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};
