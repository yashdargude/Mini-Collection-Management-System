//// filepath: /Users/yashdargude/Desktop/project/mini_manage/backend/config/redisClient.js
const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

client.on("error", (err) => console.error("Redis Client Error", err));

client.connect();

module.exports = client;
