import { leetcodeApi } from './leetcodeApi';
import { codeforcesApi } from './codeforcesApi';

export interface PlatformStats {
  totalSolved: number;
  submissions: { date: string; count: number }[];
  easySolved?: number;
  mediumSolved?: number;
  hardSolved?: number;
  error?: boolean;
  message?: string;
}

export const platformApi = {
  leetcode: {
    async getUserStats(username: string): Promise<PlatformStats> {
      return leetcodeApi.getAllUserStats(username);
    },
  },
  
  codeforces: {
    async getUserStats(handle: string): Promise<PlatformStats> {
      return codeforcesApi.getAllUserStats(handle);
    },
  },
  
  hackerrank: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getUserStats(_username: string): Promise<PlatformStats> {
      // HackerRank API implementation
      // Note: HackerRank requires API key and has different endpoints
      return {
        totalSolved: 0,
        submissions: [],
        error: true,
        message: 'HackerRank API not implemented yet'
      };
    },
  },
};

export interface PlatformData {
  platforms: Record<string, PlatformStats>;
  totalSolved: number;
  lastUpdated?: string;
  error?: string;
}

export const fetchAllPlatformStats = async (platformIds: Record<string, string>): Promise<PlatformData> => {
  const stats: Record<string, PlatformStats> = {};
  
  for (const [platform, id] of Object.entries(platformIds)) {
    if (!id) continue;
    
    try {
      switch (platform) {
        case 'leetcode':
          stats.leetcode = await platformApi.leetcode.getUserStats(id);
          break;
        case 'codeforces':
          stats.codeforces = await platformApi.codeforces.getUserStats(id);
          break;
        case 'hackerrank':
          stats.hackerrank = await platformApi.hackerrank.getUserStats(id);
          break;
        // Add cases for other platforms
      }
    } catch (error) {
      console.error(`Error fetching ${platform} stats:`, error);
      stats[platform] = {
        totalSolved: 0,
        submissions: [],
        error: true,
        message: `Failed to fetch ${platform} stats`
      };
    }
  }
  
  return {
    platforms: stats,
    totalSolved: Object.values(stats).reduce((sum, platform) => sum + platform.totalSolved, 0),
    lastUpdated: new Date().toISOString(),
  };
};
