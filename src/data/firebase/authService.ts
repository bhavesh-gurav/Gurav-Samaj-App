import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    User,
} from 'firebase/auth';
import { auth } from './config';

/**
 * Converts a 10-digit mobile number into an internal email format.
 * Example: "9876543210" → "9876543210@guravsamaj.app"
 */
const toEmail = (mobile: string): string => `${mobile}@guravsamaj.app`;

/**
 * Generates a deterministic password from mobile number.
 */
const toPassword = (mobile: string): string => `${mobile}_gurav_secure`;

/**
 * Sign in or register a user using their mobile number.
 * Tries signIn first; if user doesn't exist, creates account automatically.
 */
export const loginWithMobile = async (mobile: string): Promise<User> => {
    const email = toEmail(mobile);
    const password = toPassword(mobile);

    try {
        // Try sign-in first
        const result = await signInWithEmailAndPassword(auth, email, password);
        console.log('[Auth] Sign-in success:', result.user.uid);
        return result.user;
    } catch (signInError: any) {
        // If user not found, create new account
        if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
            console.log('[Auth] User not found, creating new account...');
            const result = await createUserWithEmailAndPassword(auth, email, password);
            console.log('[Auth] Registration success:', result.user.uid);
            return result.user;
        }
        // Re-throw other errors
        throw signInError;
    }
};

/**
 * Returns the current authenticated user or null.
 */
export const getCurrentUser = (): User | null => {
    return auth.currentUser;
};

/**
 * Returns the current user's UID, or null.
 */
export const getCurrentUserId = (): string | null => {
    return auth.currentUser?.uid ?? null;
};

/**
 * Subscribe to auth state changes.
 */
export const onAuthChanged = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

/**
 * Sign out the current user.
 */
export const logout = async (): Promise<void> => {
    await signOut(auth);
};
