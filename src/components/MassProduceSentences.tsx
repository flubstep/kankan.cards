import { useCallback, useMemo, useState } from "react";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { makeSentences } from "../api";
import { Flashcard, updateCard, useCards } from "../store/useCards";

export function MassProduceSentencesButton() {
  const { cards } = useCards();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);

  const [processed, setProcessed] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const onClose = useCallback(() => {
    if (isRunning) {
      return;
    }
    setIsOpen(false);
  }, [setIsOpen, isRunning]);

  const cardsWithoutSentences = useMemo(
    () => cards.filter((card) => !card.sentences || card.sentences.length === 0),
    [cards]
  );

  const handleStart = useCallback(
    async (emptyCards: Flashcard[]) => {
      setIsRunning(true);
      setProcessed(0);
      setTotal(emptyCards.length);
      try {
        for (const card of emptyCards) {
          setCurrentCard(card);
          const sentences = await makeSentences({ term: card.chinese, count: 3, wordCount: 10 });
          await updateCard(card.id, { sentences });
          setProcessed((processed) => processed + 1);
        }
      } catch {
        console.error("Error mass producing sentences");
      } finally {
        await setIsRunning(false);
        onClose();
      }
    },
    [setCurrentCard, setIsRunning, setTotal, setProcessed, onClose]
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mass produce sentences</ModalHeader>
          <ModalBody>
            {isRunning ? (
              <Stack direction="column" spacing={2}>
                <Text>
                  Making sentences for {currentCard?.chinese} ({currentCard?.english})
                </Text>
                <Progress value={(processed / total) * 100} />
              </Stack>
            ) : (
              <Text>
                This process will mass produce example sentences for {cardsWithoutSentences.length}{" "}
                cards that do not have any example sentences.
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              isDisabled={isRunning}
              size="sm"
              onClick={() => handleStart(cardsWithoutSentences)}
            >
              Start the process!
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Button
        variant="outline"
        size="sm"
        leftIcon={<FontAwesomeIcon icon="wand-sparkles" />}
        onClick={() => setIsOpen(true)}
      >
        Sentencify
      </Button>
    </>
  );
}
