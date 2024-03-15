import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useState } from "react";
import { useCards } from "../store/useCards";
import { cardify } from "../api";

export function CardifyModalButton() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cardText, setCardText] = useState<string>("");

  const { addCards } = useCards();

  const handleAddCards = useCallback(async () => {
    setIsLoading(true);
    const newCards = await cardify(cardText);
    await addCards(newCards);
    setIsLoading(false);
    setCardText("");
    onClose();
  }, [cardText, setCardText, onClose, addCards]);

  return (
    <>
      <Button onClick={onOpen} shadow="sm" bg="white" size="sm" variant="outline">
        <FontAwesomeIcon icon={["fas", "plus"]} style={{ marginRight: "1ex" }} />
        Add Cards
      </Button>
      <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize="md">Add New Flashcards</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              isDisabled={isLoading}
              value={cardText}
              onChange={(e) => setCardText(e.target.value)}
              placeholder="Paste your cards here"
              rows={12}
            />
          </ModalBody>
          <ModalFooter>
            <Button isDisabled={isLoading} size="sm" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              isDisabled={isLoading || cardText.length === 0}
              size="sm"
              colorScheme="blue"
              onClick={handleAddCards}
            >
              Add Cards
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
