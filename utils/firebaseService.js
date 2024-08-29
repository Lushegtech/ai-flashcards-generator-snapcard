import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase'; 

export async function saveFlashcards(setName, flashcards) {
  try {
    const docRef = await addDoc(collection(db, 'flashcards'), {
      name: setName,
      flashcards,
      createdAt: new Date(),
    });
    console.log('Document written with ID: ', docRef.id);
    return docRef.id; 
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e;
  }
}
