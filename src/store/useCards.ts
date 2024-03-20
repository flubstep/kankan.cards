import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { db } from "./firebase";

export interface Sentence {
  textChinese: string;
  pinyinChinese: string;
  textEnglish: string;
}

export interface Flashcard {
  id: string;
  chinese: string;
  pinyin: string;
  english: string;
  sentences?: Sentence[];
  active: boolean;
  createdAt: number;
}

export type NewFlashcard = Omit<Flashcard, "id" | "createdAt">;

export interface FlashcardState {
  cards: Flashcard[];
  isLoading: boolean;
}

export const useCards = create<FlashcardState>()(
  persist<FlashcardState>(
    () => ({
      cards: [],
      isLoading: true,
    }),
    {
      name: "flashcards",
    }
  )
);

const cardsRef = collection(db, "cards");
const cardsQuery = query(cardsRef, orderBy("createdAt", "desc"));
onSnapshot(cardsQuery, (snapshot) => {
  const cards: Flashcard[] = [];
  snapshot.forEach((doc) => {
    const card = doc.data() as Flashcard;
    card.id = doc.id;
    cards.push(card);
  });
  useCards.setState({ cards, isLoading: false });
});

export async function addCard(card: NewFlashcard) {
  try {
    const docRef = await addDoc(collection(db, "cards"), {
      ...card,
      active: true,
      createdAt: Date.now(),
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef; // Return the document reference
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e; // Rethrow the error to be handled by the caller
  }
}

export async function addCards(cards: NewFlashcard[]) {
  await Promise.all(cards.map((card) => addCard(card)));
}

export async function setCardActive(card: Flashcard, active: boolean) {
  try {
    await updateDoc(doc(db, "cards", card.id), { active });
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
}

export async function removeCard(card: Flashcard) {
  try {
    await deleteDoc(doc(db, "cards", card.id));
  } catch (e) {
    console.error("Error removing document: ", e);
    throw e;
  }
}

export type UpdateFlashcardRequest = Partial<Omit<Flashcard, "id" | "createdAt">>;

export async function updateCard(cardId: string, card: UpdateFlashcardRequest) {
  try {
    await updateDoc(doc(db, "cards", cardId), card);
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
}
