// src/hooks/useUserData.js

import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const useUserData = (retryCount) => {
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            setError(null); // Reset error before fetching

            try {
                const user = auth.currentUser;
                if (user) {
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);

                    let data = {};
                    if (userDoc.exists()) {
                        data = userDoc.data();
                    }

                    // Fetch profile details from subcollection
                    const profileDocRef = doc(
                        db,
                        'users',
                        user.uid,
                        'Details&Documents',
                        'ProfileDetails'
                    );
                    const profileDoc = await getDoc(profileDocRef);

                    if (profileDoc.exists()) {
                        data = { ...data, ...profileDoc.data() };
                    }

                    setUserData(data);
                } else {
                    throw new Error('User not authenticated.');
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Failed to fetch user data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [retryCount]); // Include retryCount in dependency array

    return { userData, loading, error };
};

export default useUserData;