import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export const getAssistants = async (userId) => {
  const querySnapshot = await getDocs(collection(db, "users", userId, "assistants"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addAssistant = async (userId, assistant) => {
  const ref = await addDoc(collection(db, "users", userId, "assistants"), assistant);
  return ref.id;
};

export const deleteAssistant = async (userId, assistantId) => {
  await deleteDoc(doc(db, "users", userId, "assistants", assistantId));
};

export const getEvents = async (userId) => {
  const querySnapshot = await getDocs(collection(db, "users", userId, "events"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addEvent = async (userId, event) => {
  const ref = await addDoc(collection(db, "users", userId, "events"), event);
  return ref.id;
};

export const updateEvent = async (userId, eventId, eventData) => {
  const ref = doc(db, "users", userId, "events", eventId);
  await updateDoc(ref, eventData);
};

export const deleteEvent = async (userId, eventId) => {
  await deleteDoc(doc(db, "users", userId, "events", eventId));
};
