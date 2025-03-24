interface CodeforcesUser {
  handle: string;
  rating: number;
  maxRating: number;
  rank: string;
}

interface CodeforcesSubmission {
  id: number;
  contestId: number;
  creationTimeSeconds: number;
  verdict: string;
}

const CODEFORCES_API_URL = 'https://codeforces.com/api';

export const codeforcesApi = {
  async getUserInfo(handle: string): Promise<CodeforcesUser> {
    const response = await fetch(`${CODEFORCES_API_URL}/user.info?handles=${handle}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch Codeforces user info');
    }

    const data = await response.json();
    return data.result[0];
  },

  async getUserSubmissions(handle: string): Promise<CodeforcesSubmission[]> {
    const response = await fetch(`${CODEFORCES_API_URL}/user.status?handle=${handle}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch Codeforces submissions');
    }

    const data = await response.json();
    return data.result;
  },

  async getAllUserStats(handle: string) {
    try {
      const [userInfo, submissions] = await Promise.all([
        this.getUserInfo(handle),
        this.getUserSubmissions(handle),
      ]);

      // Process submissions into a format suitable for charts
      const acceptedSubmissions = submissions.filter(
        (sub) => sub.verdict === 'OK'
      );

      // Group submissions by date
      const submissionsByDate = acceptedSubmissions.reduce((acc, sub) => {
        const date = new Date(sub.creationTimeSeconds * 1000)
          .toISOString()
          .split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Convert to array format
      const submissionsArray = Object.entries(submissionsByDate).map(
        ([date, count]) => ({
          date,
          count,
        })
      );

      return {
        handle: userInfo.handle,
        rating: userInfo.rating,
        maxRating: userInfo.maxRating,
        rank: userInfo.rank,
        totalSolved: acceptedSubmissions.length,
        submissions: submissionsArray.sort((a, b) => a.date.localeCompare(b.date)),
      };
    } catch (error) {
      console.error('Error fetching Codeforces stats:', error);
      throw error;
    }
  },
};
