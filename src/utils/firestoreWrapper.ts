// Firestore wrapper utilities to safely handle operations when Firestore is blocked
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  DocumentReference, 
  DocumentSnapshot,
  DocumentData,
  UpdateData,
  WithFieldValue,
  PartialWithFieldValue
} from 'firebase/firestore';
import { getFirestore, isFirestoreAvailable, recordFirestoreError } from '../config/firebase';

// Safe wrapper for doc() that returns null when Firestore is blocked
export const safeDoc = (path: string, ...pathSegments: string[]): DocumentReference | null => {
  const firestore = getFirestore();
  if (!firestore || !isFirestoreAvailable()) {
    return null;
  }
  return doc(firestore, path, ...pathSegments);
};

// Safe wrapper for getDoc() that throws when Firestore is blocked
export const safeGetDoc = async (docRef: DocumentReference | null): Promise<DocumentSnapshot<DocumentData> | null> => {
  if (!docRef || !isFirestoreAvailable()) {
    throw new Error('Firestore is currently unavailable');
  }
  
  try {
    return await getDoc(docRef);
  } catch (error: any) {
    recordFirestoreError(error);
    throw error;
  }
};

// Safe wrapper for setDoc() that throws when Firestore is blocked
export const safeSetDoc = async (
  docRef: DocumentReference | null, 
  data: WithFieldValue<DocumentData>
): Promise<void> => {
  if (!docRef || !isFirestoreAvailable()) {
    throw new Error('Firestore is currently unavailable');
  }
  
  try {
    return await setDoc(docRef, data);
  } catch (error: any) {
    recordFirestoreError(error);
    throw error;
  }
};

// Safe wrapper for updateDoc() that throws when Firestore is blocked
export const safeUpdateDoc = async (
  docRef: DocumentReference | null,
  data: UpdateData<DocumentData>
): Promise<void> => {
  if (!docRef || !isFirestoreAvailable()) {
    throw new Error('Firestore is currently unavailable');
  }
  
  try {
    return await updateDoc(docRef, data);
  } catch (error: any) {
    recordFirestoreError(error);
    throw error;
  }
};

// Helper to check if a Firestore operation should be attempted
export const shouldAttemptFirestoreOperation = (): boolean => {
  return isFirestoreAvailable();
};
