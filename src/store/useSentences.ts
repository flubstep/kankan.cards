import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useMemo } from 'react';
import { create } from 'zustand';

import { db } from './firebase';

export interface Sentence {
  id: string;
  chinese: string;
  pinyin: string;
  english: string;
  createdAt: number;
}

export type NewSentence = Omit<Sentence, "id" | "createdAt">;

export interface SentencesState {
  sentencesByTerm: Record<string, Sentence[]>;
  isLoadingByTerm: Record<string, boolean>;
}

export const useSentences = create<SentencesState>(() => ({
  sentencesByTerm: {},
  isLoadingByTerm: {},
}));

export async function addSentence(newSentence: NewSentence) {
  return addDoc(collection(db, "sentences"), {
    ...newSentence,
    createdAt: Date.now(),
  });
}

export async function removeSentence(id: string) {
  return deleteDoc(doc(db, "sentences", id));
}

export async function loadSentencesForTerm(term: string) {
  if (useSentences.getState().isLoadingByTerm[term] !== undefined) {
    return;
  }
  const termLoading = { [term]: true };
  useSentences.setState((state) => ({
    ...state,
    isLoadingByTerm: {
      ...state.isLoadingByTerm,
      ...termLoading,
    },
  }));
  const snapshot = await getDocs(query(collection(db, "sentences"), where("term", "==", term)));
  const sentences: Sentence[] = [];
  snapshot.forEach((doc) => {
    const sentence = doc.data() as Sentence;
    sentence.id = doc.id;
    sentences.push(sentence);
  });
  const termSentences = { [term]: sentences };
  termLoading[term] = false;
  useSentences.setState((state) => ({
    ...state,
    sentencesByTerm: {
      ...state.sentencesByTerm,
      ...termSentences,
    },
    isLoadingByTerm: {
      ...state.isLoadingByTerm,
      ...termLoading,
    },
  }));
}

export function useSentencesForTerms(terms: string[]) {
  const { sentencesByTerm, isLoadingByTerm } = useSentences();

  const isLoading = useMemo(
    () => terms.some((term) => isLoadingByTerm[term]),
    [isLoadingByTerm, terms]
  );

  const filteredSentencesByTerm = useMemo(() => {
    const filteredItems = {} as Record<string, Sentence[]>;
    for (const term of terms) {
      if (sentencesByTerm[term]) {
        filteredItems[term] = sentencesByTerm[term];
      }
    }
    return filteredItems;
  }, [sentencesByTerm, terms]);

  useEffect(() => {
    terms.forEach((term) => {
      loadSentencesForTerm(term);
    });
  }, [terms]);

  return {
    isLoading,
    filteredSentencesByTerm,
  };
}
