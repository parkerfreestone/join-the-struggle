import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { Session } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { useContext } from "react";
import { SupabaseContext } from "../context/SupabaseContext";

interface AuthenticationModalProps {
  session: Session | null;
}

export const AuthenticateModal = ({ session }: AuthenticationModalProps) => {
  const { supabase } = useContext(SupabaseContext)!;

  if (!supabase) {
    return <div>Loading...</div>;
  }

  return (
    <Modal
      backdrop="blur"
      isOpen={!session}
      isDismissable={false}
      isKeyboardDismissDisabled
      hideCloseButton
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Login to The Struggle
            </ModalHeader>
            <ModalBody>
              <Auth
                supabaseClient={supabase}
                providers={["discord"]}
                appearance={{
                  extend: false,
                  className: {
                    button:
                      "group mb-4 relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-unit-4 h-unit-10 text-small gap-unit-2 rounded-medium [&>svg]:max-w-[theme(spacing.unit-8)] data-[pressed=true]:scale-[0.97] transition-transform-colors motion-reduce:transition-none border-2 border-color-default text-default-foreground w-full",
                  },
                }}
                onlyThirdPartyProviders
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
