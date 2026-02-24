import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    addDoc,
    Timestamp,
} from 'firebase/firestore';
import { db } from './config';

// ────────────────────────────────────────────────
// TypeScript Interfaces
// ────────────────────────────────────────────────

export interface UserProfile {
    id: string;
    mobileNumber: string;
    name: string;
    birthDate: string;
    birthDay: number;
    birthMonth: number;
    createdAt: Timestamp;
}

export interface CommunityEvent {
    id: string;
    eventName: string;
    description: string;
    address: string;
    city: string;
    eventDate: string;
    startTime: string;
    contactNumber: string;
    createdByUserId: string;
    createdByName: string;
    createdAt: Timestamp;
}

// ────────────────────────────────────────────────
// User Profile Operations
// ────────────────────────────────────────────────

export const saveUserProfile = async (
    userId: string,
    mobileNumber: string,
    name: string,
    birthDate: string
): Promise<void> => {
    const bd = new Date(birthDate);
    const profile: Omit<UserProfile, 'id'> & { id: string } = {
        id: userId,
        mobileNumber,
        name,
        birthDate,
        birthDay: bd.getDate(),
        birthMonth: bd.getMonth(),
        createdAt: Timestamp.now(),
    };
    await setDoc(doc(db, 'users', userId), profile, { merge: true });
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    const snap = await getDoc(doc(db, 'users', userId));
    if (snap.exists()) {
        return snap.data() as UserProfile;
    }
    return null;
};

// ────────────────────────────────────────────────
// Birthday Queries (Indexed: birthMonth + birthDay)
// ────────────────────────────────────────────────

export const getTodaysBirthdays = async (): Promise<UserProfile[]> => {
    const today = new Date();
    const q = query(
        collection(db, 'users'),
        where('birthMonth', '==', today.getMonth()),
        where('birthDay', '==', today.getDate())
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ ...d.data(), id: d.id } as UserProfile));
};

// ────────────────────────────────────────────────
// Event Operations
// ────────────────────────────────────────────────

export const createEvent = async (
    event: Omit<CommunityEvent, 'id' | 'createdAt'>
): Promise<string> => {
    const ref = await addDoc(collection(db, 'events'), {
        ...event,
        createdAt: Timestamp.now(),
    });
    return ref.id;
};

export const getUpcomingEvents = async (): Promise<CommunityEvent[]> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const q = query(
        collection(db, 'events'),
        where('eventDate', '>=', today.toISOString()),
        orderBy('eventDate', 'asc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ ...d.data(), id: d.id } as CommunityEvent));
};

/*
 * ════════════════════════════════════════════════
 * FIRESTORE SECURITY RULES (copy to Firebase Console)
 * ════════════════════════════════════════════════
 *
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *
 *     // Users collection
 *     match /users/{userId} {
 *       allow read: if request.auth != null;
 *       allow create, update: if request.auth != null && request.auth.uid == userId;
 *       allow delete: if false;
 *     }
 *
 *     // Events collection
 *     match /events/{eventId} {
 *       allow read: if request.auth != null;
 *       allow create: if request.auth != null;
 *       allow update, delete: if request.auth != null
 *         && resource.data.createdByUserId == request.auth.uid;
 *     }
 *   }
 * }
 *
 * REQUIRED COMPOSITE INDEXES:
 * 1. Collection: users → Fields: birthMonth (ASC), birthDay (ASC)
 * 2. Collection: events → Fields: eventDate (ASC)
 */
