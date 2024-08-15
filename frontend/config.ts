const localConfig = {
  API_BASE_URL: "http://localhost:8000",
};

const productionConfig = {
  API_BASE_URL: "https://race-the-clock-backend-production.up.railway.app",
};

export const config =
  process.env.NODE_ENV === "production" ? productionConfig : localConfig;
