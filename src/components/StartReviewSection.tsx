import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

enum Positions {
  Front,
  Back,
  Hidden,
}

function SelectPositionButtonGroup({
  label,
  position,
  setPosition,
}: {
  label: string;
  position: Positions;
  setPosition: (position: Positions) => void;
}) {
  return (
    <Flex justify="space-between" align="center" gap={4}>
      <Text fontSize={label.length < 3 ? "xl" : "md"}>{label}</Text>
      <ButtonGroup size="sm" variant="solid" isAttached>
        <Button
          onClick={() => setPosition(Positions.Front)}
          colorScheme={position === Positions.Front ? "green" : "gray"}
        >
          Show on Front
        </Button>
        <Button
          onClick={() => setPosition(Positions.Back)}
          colorScheme={position === Positions.Back ? "green" : "gray"}
        >
          Show on Back
        </Button>
        <Button
          onClick={() => setPosition(Positions.Hidden)}
          colorScheme={position === Positions.Hidden ? "green" : "gray"}
        >
          Hide
        </Button>
      </ButtonGroup>
    </Flex>
  );
}

export function StartReviewSection() {
  const [chinesePosition, setChinesePosition] = useState<Positions>(Positions.Front);
  const [pinyinPosition, setPinyinPosition] = useState<Positions>(Positions.Front);
  const [englishPosition, setEnglishPosition] = useState<Positions>(Positions.Back);
  const [numReviews, setNumReviews] = useState<number>(30);

  const isDisabled = useMemo(() => {
    const positions = [chinesePosition, pinyinPosition, englishPosition];
    return !(
      positions.filter((position) => position === Positions.Front).length > 0 &&
      positions.filter((position) => position === Positions.Back).length > 0
    );
  }, [chinesePosition, pinyinPosition, englishPosition]);

  const navigate = useNavigate();
  const startReview = useCallback(() => {
    navigate(
      `/review?chinese=${chinesePosition}&pinyin=${pinyinPosition}&english=${englishPosition}&numReviews=${numReviews}`
    );
  }, [navigate, chinesePosition, pinyinPosition, englishPosition, numReviews]);

  return (
    <Flex
      flexDir="column"
      minWidth={[0, 640]}
      my={4}
      py={4}
      align="center"
      bg="white"
      shadow="md"
      borderRadius={8}
    >
      <Box mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          Review Flashcards: Options
        </Text>
      </Box>
      <Flex gap={8}>
        <Flex flexDirection="column" align="stretch" justify="center" gap={1}>
          <SelectPositionButtonGroup
            label="漢字"
            position={chinesePosition}
            setPosition={setChinesePosition}
          />
          <SelectPositionButtonGroup
            label="Pinyin"
            position={pinyinPosition}
            setPosition={setPinyinPosition}
          />
          <SelectPositionButtonGroup
            label="English"
            position={englishPosition}
            setPosition={setEnglishPosition}
          />
          <Flex gap={8} mt={1}>
            <Text>Cards</Text>
            <Slider
              aria-label="Number of reviews"
              value={numReviews}
              onChange={setNumReviews}
              min={10}
              max={100}
              step={10}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Flex>
        </Flex>
      </Flex>

      <Flex mt={4} px={4} justify="center">
        <Button
          onClick={startReview}
          size="sm"
          width="full"
          variant="solid"
          colorScheme="blue"
          isDisabled={isDisabled}
        >
          <FontAwesomeIcon icon={["fas", "play-circle"]} style={{ marginRight: "1ex" }} />
          Review {numReviews} flashcards
        </Button>
      </Flex>
    </Flex>
  );
}
