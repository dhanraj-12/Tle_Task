export const cfApiConfig = {
  baseUrl: process.env.CF_BASE_URL || "https://codeforces.com/api",
  endpoints: {
    userInfo: (handle: string) => `/user.info?handles=${handle}`,
    userRating: (handle: string) => `/user.rating?handle=${handle}`,
    contestStanding: "/contest.standings?",
    userStatus: "/user.status?"

  },
};
