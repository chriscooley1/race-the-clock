const localConfig = {
  API_BASE_URL: "http://localhost:8000",
  ALLOWED_ORIGINS: ["http://localhost:5173"],
};

const productionConfig = {
  API_BASE_URL: "https://your-production-api.com",
  ALLOWED_ORIGINS: ["https://chriscooley1.github.io/race-the-clock/"],
};

export const config =
  process.env.NODE_ENV === "production" ? productionConfig : localConfig;
