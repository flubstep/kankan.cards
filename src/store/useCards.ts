import { useCallback, useEffect, useState } from "react";

import { db } from "./firebase";
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

export interface Flashcard {
  id: string;
  chinese: string;
  pinyin: string;
  english: string;
  active: boolean;
  createdAt: number;
}

export type NewFlashcard = Omit<Flashcard, "id" | "createdAt">;

export function useCards() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cards, setCards] = useState<Flashcard[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const cardsRef = collection(db, "cards");
    const cardsQuery = query(cardsRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(cardsQuery, (snapshot) => {
      const cards: Flashcard[] = [];
      snapshot.forEach((doc) => {
        const card = doc.data() as Flashcard;
        card.id = doc.id;
        cards.push(card);
      });
      setCards(cards);
      setIsLoading(false);
    });
    return unsubscribe;
  }, [setCards, setIsLoading]);

  const addCard = useCallback(async (card: NewFlashcard) => {
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
  }, []);

  const addCards = useCallback(
    async (cards: NewFlashcard[]) => {
      await Promise.all(cards.map((card) => addCard(card)));
    },
    [addCard]
  );

  const setCardActive = useCallback(async (card: Flashcard, active: boolean) => {
    try {
      await updateDoc(doc(db, "cards", card.id), { active });
    } catch (e) {
      console.error("Error updating document: ", e);
      throw e;
    }
  }, []);

  const removeCard = useCallback(async (card: Flashcard) => {
    try {
      await deleteDoc(doc(db, "cards", card.id));
    } catch (e) {
      console.error("Error removing document: ", e);
      throw e;
    }
  }, []);

  return {
    cards,
    addCards,
    setCardActive,
    removeCard,
    isLoading,
  };
}
