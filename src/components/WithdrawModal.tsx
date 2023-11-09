import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
} from "@nextui-org/react";
import { useContext } from "react";
import { SupabaseContext } from "../context/SupabaseContext";
import { Flag } from "lucide-react";

interface WithdrawModalProps {
  isOpen: any;
  onClose: any;
}

export const WithdrawModal = ({ isOpen, onClose }: WithdrawModalProps) => {
  const { painfullyWithdraw } = useContext(SupabaseContext)!;

  const onWithdrawClick = () => {
    onClose();
    painfullyWithdraw();
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      scrollBehavior="inside"
      isKeyboardDismissDisabled
      isDismissable
    >
      <ModalContent>
        {() => (
          <ScrollShadow>
            <ModalHeader className="flex flex-col gap-1">
              Acknowledgment of Forfeit
            </ModalHeader>
            <ModalBody>
              By selecting 'Yes', you hereby acknowledge and confirm your
              forfeit of the challenge and your subsequent withdrawal from The
              Struggle this fine November. <br />
              <br />
              Please understand that in doing so, you are acknowledging that
              your journey in this challenge has come to an end for this year.
              It's important to remember that every journey has its ups and
              downs, and sometimes we fall short of our goals. That's perfectly
              okay. It's part of the learning and growing process. <br /> <br />
              While your active participation in The Struggle might be
              concluding, we encourage you to reflect on your experience, the
              lessons learned, and the strengths you've discovered within
              yourself during this time. Remember, this isn't a failure; it's a
              stepping stone towards greater self-awareness and control.
              <br />
              <br />
              If you feel ready to confirm your forfeiture, please click 'Yes'
              below. However, if you believe this was a momentary setback and
              you wish to continue your journey, you may select 'No' and carry
              on with the challenge.
              <br />
              <br />
              Remember, whatever choice you make, it's about personal growth and
              understanding yourself better. We're proud of the effort you've
              put in, and we'll be here to support you, regardless of your
              decision.
            </ModalBody>
            <ModalFooter>
              <Button variant="light" color="primary" onPress={onClose}>
                No, I'm here by Accident!
              </Button>
              <Button variant="shadow" color="danger" onClick={onWithdrawClick}>
                <Flag className="w-4 h-4" />
                Withdraw
              </Button>
            </ModalFooter>
          </ScrollShadow>
        )}
      </ModalContent>
    </Modal>
  );
};
