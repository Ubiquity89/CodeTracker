interface LeetCodeUserProfile {
  matchedUser: {
    username: string;
    submitStats: {
      acSubmissionNum: {
        difficulty: string;
        count: number;
      }[];
    };
  };
}

interface LeetCodeSubmissionCalendar {
  matchedUser: {
    userCalendar: {
      activeYears: number[];
      streak: number;
      totalActiveDays: number;
      submissionCalendar: string; // JSON string of date -> count
    };
  };
}

const LEETCODE_API_URL = 'https://leetcode.com/graphql';

export const leetcodeApi = {
  async getUserProfile(username: string): Promise<LeetCodeUserProfile> {
    const query = `
      query userProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;

    const response = await fetch(LEETCODE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch LeetCode profile');
    }

    return response.json();
  },

  async getSubmissionCalendar(username: string): Promise<LeetCodeSubmissionCalendar> {
    const query = `
      query userSubmissionCalendar($username: String!) {
        matchedUser(username: $username) {
          userCalendar {
            activeYears
            streak
            totalActiveDays
            submissionCalendar
          }
        }
      }
    `;

    const response = await fetch(LEETCODE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch LeetCode submission calendar');
    }

    return response.json();
  },

  async getAllUserStats(username: string) {
    try {
      const [profile, calendar] = await Promise.all([
        this.getUserProfile(username),
        this.getSubmissionCalendar(username),
      ]);

      const submissionCalendar = JSON.parse(
        calendar.matchedUser.userCalendar.submissionCalendar
      );

      // Process submission calendar into a format suitable for charts
      const submissions = Object.entries(submissionCalendar).map(([timestamp, count]) => ({
        date: new Date(Number(timestamp) * 1000).toISOString().split('T')[0],
        count: Number(count),
      }));

      // Get problem counts by difficulty
      const difficultyStats = profile.matchedUser.submitStats.acSubmissionNum.reduce(
        (acc, { difficulty, count }) => {
          acc[difficulty.toLowerCase()] = count;
          return acc;
        },
        {} as Record<string, number>
      );

      return {
        username: profile.matchedUser.username,
        totalSolved: difficultyStats.all || 0,
        easySolved: difficultyStats.easy || 0,
        mediumSolved: difficultyStats.medium || 0,
        hardSolved: difficultyStats.hard || 0,
        streak: calendar.matchedUser.userCalendar.streak,
        totalActiveDays: calendar.matchedUser.userCalendar.totalActiveDays,
        submissions: submissions.sort((a, b) => a.date.localeCompare(b.date)),
      };
    } catch (error) {
      console.error('Error fetching LeetCode stats:', error);
      throw error;
    }
  },
};
