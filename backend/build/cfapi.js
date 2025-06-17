"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cfApiConfig = void 0;
exports.cfApiConfig = {
    baseUrl: process.env.CF_BASE_URL || "https://codeforces.com/api",
    endpoints: {
        userInfo: (handle) => `/user.info?handles=${handle}`,
        userRating: (handle) => `/user.rating?handle=${handle}`,
        contestStanding: "/contest.standings?",
        userStatus: "/user.status?"
    },
};
