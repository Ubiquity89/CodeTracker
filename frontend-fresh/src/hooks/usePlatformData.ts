import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { fetchAllPlatformStats } from '../services/platformApi';

export const usePlatformData = () => {
  return useQuery({
    queryKey: ['platformData', auth.currentUser?.uid],
    queryFn: async () => {
      if (!auth.currentUser) {
        throw new Error('No user logged in');
      }

      // Get user's platform IDs from Firestore
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      const userData = userDoc.data();

      if (!userData?.platformIds) {
        return {
          platforms: {},
          totalSolved: 0,
          error: 'No platform IDs found',
        };
      }

      // Fetch data from all platforms
      const platformData = await fetchAllPlatformStats(userData.platformIds);

      // Calculate total solved problems across all platforms
      const totalSolved = Object.values(platformData).reduce(
        (sum, platform) => sum + (platform.totalSolved || 0),
        0
      );

      return {
        platforms: platformData,
        totalSolved,
        lastUpdated: new Date().toISOString(),
      };
    },
    refetchInterval: 1000 * 60 * 15, // Refetch every 15 minutes
    staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
  });
};
