import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Replace these with your actual Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Google Sign In
export const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/trip-selection`,
        },
    });

    if (error) {
        console.error('Error signing in with Google:', error.message);
        throw error;
    }

    return data;
};

// Sign Out
export const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Error signing out:', error.message);
        throw error;
    }
};

// Get current user
export const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
        console.error('Error getting user:', error.message);
        return null;
    }

    return user;
};

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session);
    });
};
