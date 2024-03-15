import {
  Box,
  Button,
  Flex,
  Image,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCards } from "../store/useCards";
import { CardifyModalButton } from "./CardifyModalButton";
import { StartReviewSection } from "./StartReviewSection";
import { useWindowSize } from "@uidotdev/usehooks";

export function IndexPage() {
  const { cards, setCardActive, removeCard } = useCards();
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
                <Td colSpan={5}>
                  <Flex justify="space-between" align="center">
                    <Flex align="center" gap={1}>
                      <FontAwesomeIcon icon={["fas", "layer-group"]} />
                      <Text fontSize="lg" fontWeight="bold">
                        Flashcards
                      </Text>
                    </Flex>
                    <CardifyModalButton />
                  </Flex>
                </Td>
              </Tr>
              <Tr fontWeight="bold">
                <Td textAlign="center">漢字</Td>
                <Td textAlign="center">English</Td>
                {isDesktop && <Td textAlign="center">Active</Td>}
                {isDesktop && <Td />}
              </Tr>
            </Thead>
            <Tbody>
              {cards.map((card) => (
                <Tr key={card.id}>
                  <Td textAlign="center">
                    <Text fontSize="lg">{card.chinese}</Text>
                    <Text>{card.pinyin}</Text>
                  </Td>
                  <Td textAlign="center">{card.english}</Td>
                  {isDesktop && (
                    <Td textAlign="center">
                      <Switch
                        isChecked={card.active}
                        onChange={() => setCardActive(card, !card.active)}
                        colorScheme="green"
                      />
                    </Td>
                  )}
                  {isDesktop && (
                    <Td>
                      <Button
                        onClick={() => removeCard(card)}
                        color="gray.700"
                        size="xs"
                        variant="outline"
                        aria-label="Other Actions"
                      >
                        Remove
                      </Button>
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
