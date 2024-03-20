import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import _ from "lodash";

import { Button, ButtonGroup, CircularProgress, Flex, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Flashcard, useCards } from "../store/useCards";

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
  const [sentenceIndex, setSentenceIndex] = useState<{ [key: string]: number }>({});

  const chinesePosition = Number.parseInt(searchParams.get("chinese") || "0") as Position;
  const pinyinPosition = Number.parseInt(searchParams.get("pinyin") || "0") as Position;
  const englishPosition = Number.parseInt(searchParams.get("english") || "1") as Position;
  const numReviews = Number.parseInt(searchParams.get("numReviews") || "10");
  const useSentences = searchParams.get("useSentences") === "1";

  const updateSentenceIndexes = useCallback(
    (cards: Flashcard[]) => {
      const newSentenceIndex: { [key: string]: number } = {};
      for (const card of cards) {
        if (!card.sentences) {
          continue;
        }
        const max = card.sentences?.length || 0;
        newSentenceIndex[card.id] = _.random(0, max);
      }
      setSentenceIndex(newSentenceIndex);
    },
    [setSentenceIndex]
  );

  useEffect(() => {
    if (reviewCards.length > 0 || currentCardIndex > 0) {
      return;
    }
    const cardsToReview = cards.filter((card) => card.active);
    const shuffled = _.shuffle(cardsToReview);
    const toReview = shuffled.slice(0, numReviews);
    setReviewCards(toReview);
    setCurrentCardIndex(0);
  }, [numReviews, cards, currentCardIndex, reviewCards, useSentences]);

  const currentCard = reviewCards[currentCardIndex];
  const currentCardOrSentence = useMemo(() => {
    if (!useSentences) {
      return currentCard;
    }
    if (!currentCard?.sentences) {
      return currentCard;
    }
    let index = sentenceIndex[currentCard.id];
    if (index === undefined) {
      index = 0;
    }
    const sentence = currentCard.sentences[index];
    return {
      ...currentCard,
      chinese: sentence.textChinese,
      pinyin: sentence.pinyinChinese,
      english: sentence.textEnglish,
    };
  }, [useSentences, currentCard, sentenceIndex]);

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

  const width = useSentences ? 320 : 250;

  return (
    <Flex flexDir="column" w="100vw" h="100dvh" align="center" justify="center" gap={2}>
      <Flex align="flex-end" justify="space-between" w={width} px={4}>
        <Link to="/">
          <Flex align="center" gap={1}>
            <FontAwesomeIcon icon="caret-left" />
            Go back
          </Flex>
        </Link>
        <Text>
          Card {currentCardIndex + 1} / {reviewCards.length}
        </Text>
      </Flex>
      <Flex
        flexDirection="column"
        w={width}
        h={320}
        p={useSentences ? 8 : 4}
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
        {currentCardSide === chinesePosition && (
          <Text fontSize={useSentences ? "2xl" : "4xl"}>{currentCardOrSentence.chinese}</Text>
        )}
        {currentCardSide === pinyinPosition && (
          <Text color="gray.700" fontSize={useSentences ? "md" : "xl"}>
            {currentCardOrSentence.pinyin}
          </Text>
        )}
        {currentCardSide === englishPosition && (
          <Text fontSize="xl">{currentCardOrSentence.english}</Text>
        )}
      </Flex>
      <ButtonGroup size="sm" variant="text" colorScheme="black">
        <Button onClick={nextCard}>Fail</Button>
        <Button onClick={nextCard}>Hard</Button>
        <Button onClick={nextCard}>Good</Button>
        <Button onClick={nextCard}>Easy</Button>
      </ButtonGroup>
    </Flex>
  );
}
