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

export function IndexPage() {
  const { cards, setCardActive, removeCard } = useCards();
  return (
    <Box width="100vw" height="100dvh">
      <VStack>
        <Box shadow="md" bg="white" my={8} p={4} borderRadius={8}>
          <Image height={196} src="/binoculars-with-text.svg" />
        </Box>
        <TableContainer shadow="md" bg="white" borderRadius={8}>
          <Table minWidth={640} align="center">
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
                <Td textAlign="center">Pinyin</Td>
                <Td textAlign="center">English</Td>
                <Td textAlign="center">Active</Td>
                <Td />
              </Tr>
            </Thead>
            <Tbody>
              {cards.map((card) => (
                <Tr key={card.id}>
                  <Td textAlign="center">{card.chinese}</Td>
                  <Td textAlign="center">{card.pinyin}</Td>
                  <Td textAlign="center">{card.english}</Td>
                  <Td textAlign="center">
                    <Switch
                      isChecked={card.active}
                      onChange={() => setCardActive(card, !card.active)}
                      colorScheme="green"
                    />
                  </Td>
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
