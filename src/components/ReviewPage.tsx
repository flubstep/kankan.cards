import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Flashcard, useCards } from "../store/useCards";
import _ from "lodash";
import { Button, ButtonGroup, CircularProgress, Flex, Text } from "@chakra-ui/react";

enum Position {
  Front,
  Back,
  Hidden,
}

export function ReviewPage() {
  const [searchParams] = useSearchParams();
  const { cards } = useCards();

  const [reviewCards, setReviewCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [currentCardSide, setCurrentCardSide] = useState<Position>(Position.Front);

  const chinesePosition = Number.parseInt(searchParams.get("chinese") || "0") as Position;
  const pinyinPosition = Number.parseInt(searchParams.get("pinyin") || "0") as Position;
  const englishPosition = Number.parseInt(searchParams.get("english") || "1") as Position;
  const numReviews = Number.parseInt(searchParams.get("numReviews") || "10");

  useEffect(() => {
    if (reviewCards.length > 0 || currentCardIndex > 0) {
      return;
    }
    const cardsToReview = cards.filter((card) => card.active);
    const shuffled = _.shuffle(cardsToReview);
    const toReview = shuffled.slice(0, numReviews);
    setReviewCards(toReview);
    setCurrentCardIndex(0);
  }, [numReviews, cards, currentCardIndex, reviewCards]);

  const currentCard = reviewCards[currentCardIndex];
  const navigate = useNavigate();

  const nextCard = useCallback(() => {
    if (currentCardIndex + 1 >= reviewCards.length) {
      navigate("/");
    }
    setCurrentCardIndex((index) => index + 1);
    setCurrentCardSide(Position.Front);
  }, [currentCardIndex, navigate, reviewCards.length]);

  const flipCard = useCallback(() => {
    if (currentCardSide === Position.Front) {
      setCurrentCardSide(Position.Back);
    }
    if (currentCardSide === Position.Back) {
      setCurrentCardSide(Position.Front);
    }
  }, [currentCardSide]);

  if (!currentCard) {
    return (
      <Flex flexDir="column" w="100vw" h="100dvh" align="center" justify="center" gap={2}>
        <CircularProgress isIndeterminate />
      </Flex>
    );
  }

  return (
    <Flex flexDir="column" w="100vw" h="100dvh" align="center" justify="center" gap={2}>
      <Text>
        Card {currentCardIndex + 1} / {reviewCards.length}
      </Text>
      <Flex
        flexDirection="column"
        w={250}
        h={320}
        p={4}
        textAlign="center"
        borderRadius={8}
        bg="white"
        shadow="md"
        align="center"
        justify="center"
        cursor="pointer"
        onClick={flipCard}
        onMouseDown={(e) => e.preventDefault()}
      >
        {currentCardSide === chinesePosition && <Text fontSize="4xl">{currentCard.chinese}</Text>}
        {currentCardSide === pinyinPosition && <Text fontSize="xl">{currentCard.pinyin}</Text>}
        {currentCardSide === englishPosition && <Text fontSize="xl">{currentCard.english}</Text>}
      </Flex>
      <ButtonGroup size="sm" variant="text" colorScheme="black">
        <Button onClick={nextCard}>Missed</Button>
        <Button onClick={nextCard}>Slow</Button>
        <Button onClick={nextCard}>Great</Button>
      </ButtonGroup>
    </Flex>
  );
}
