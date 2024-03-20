import { useCallback, useState } from 'react';

import {
    Box,
    Button,
    Divider,
    Flex,
    IconButton,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Thead,
    Tr,
    VStack,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useWindowSize } from '@uidotdev/usehooks';

import { makeSentences } from '../api';
import { Flashcard, removeCard, setCardActive, updateCard, useCards } from '../store/useCards';
import { CardifyModalButton } from './CardifyModalButton';
import { MassProduceSentencesButton } from './MassProduceSentences';
import { StartReviewSection } from './StartReviewSection';

function CardPreview({ card }: { card: Flashcard }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const sentences = card.sentences || [];
  const numSentences = sentences.length;

  const handleDeleteSentences = useCallback(async () => {
    setIsLoading(true);
    try {
      await updateCard(card.id, { sentences: [] });
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, card, setIsOpen]);

  const handleRefreshSentences = useCallback(async () => {
    setIsLoading(true);
    try {
      const sentences = await makeSentences({ term: card.chinese, count: 3, wordCount: 10 });
      await updateCard(card.id, { sentences });
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, card]);
  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize="md">Examples for: {card.chinese}</Text>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <Stack direction="column" spacing={4} divider={<Divider />}>
              {Array.isArray(sentences) &&
                sentences.map((sentence) => (
                  <Box opacity={isLoading ? 0.5 : 1.0}>
                    <Text fontSize="lg">{sentence.textChinese}</Text>
                    <Text fontSize="xs" color="gray.700">
                      {sentence.pinyinChinese}
                    </Text>
                    <Box h={2} />
                    <Text>{sentence.textEnglish}</Text>
                  </Box>
                ))}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Stack direction="row">
              <Button
                isDisabled={isLoading}
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={handleDeleteSentences}
              >
                Delete examples
              </Button>
              <Button
                isDisabled={isLoading}
                size="sm"
                variant="outline"
                leftIcon={<FontAwesomeIcon spin={isLoading} icon="arrows-rotate" />}
                onClick={handleRefreshSentences}
              >
                Regenerate examples
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Text fontSize="lg">{card.chinese}</Text>
      <Text fontSize="xs">{card.pinyin}</Text>
      <Text>{card.english}</Text>
      <Flex align="center" justify="center">
        <Button
          isDisabled={numSentences === 0}
          variant="text"
          size="xs"
          p={0}
          onClick={() => setIsOpen(true)}
        >
          Examples: {numSentences}
        </Button>
        <IconButton
          aria-label="Make sentences"
          variant="ghost"
          size="xs"
          fontSize={10}
          isDisabled={isLoading}
          icon={<FontAwesomeIcon spin={isLoading} icon="arrows-rotate" />}
          onClick={handleRefreshSentences}
        />
      </Flex>
    </>
  );
}

export function IndexPage() {
  const { cards } = useCards();
  const { width } = useWindowSize();
  const isDesktop = width && width > 480;

  return (
    <Box width="100vw" height="100dvh">
      <VStack>
        <Box mt={8}>
          <Image height="80px" src="/binoculars-with-text-wide.svg" />
        </Box>
        <StartReviewSection />
        <TableContainer
          minWidth={[0, 640]}
          shadow={["none", "md"]}
          bg="white"
          borderRadius={[0, 8]}
        >
          <Table align="center">
            <Thead>
              <Tr>
                <Td colSpan={3}>
                  <Flex justify="space-between" align="center">
                    <Flex align="center" gap={1}>
                      <FontAwesomeIcon icon={["fas", "layer-group"]} />
                      <Text fontSize="lg" fontWeight="bold">
                        Flashcards ({cards.length})
                      </Text>
                    </Flex>
                    <Stack direction="row">
                      <MassProduceSentencesButton />
                      <CardifyModalButton />
                    </Stack>
                  </Flex>
                </Td>
              </Tr>
            </Thead>
            <Tbody>
              {cards.map((card) => (
                <Tr key={card.id}>
                  <Td textAlign="center" width={isDesktop ? "75%" : "100%"}>
                    <CardPreview card={card} />
                  </Td>
                  {isDesktop && (
                    <Td>
                      <Stack direction="column">
                        {card.active ? (
                          <Button
                            onClick={() => setCardActive(card, false)}
                            size="xs"
                            variant="outline"
                            colorScheme="green"
                            aria-label="Active"
                          >
                            Active
                          </Button>
                        ) : (
                          <Button
                            onClick={() => setCardActive(card, true)}
                            size="xs"
                            variant="outline"
                            color="gray.400"
                            colorScheme="gray"
                            aria-label="Deactivated"
                          >
                            Deactivated
                          </Button>
                        )}
                        <Button
                          onClick={() => removeCard(card)}
                          colorScheme="red"
                          size="xs"
                          variant="ghost"
                          aria-label="Other Actions"
                        >
                          Remove
                        </Button>
                      </Stack>
                    </Td>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
      <Box h={8} />
    </Box>
  );
}
