const config = {
  // Services
  // Якщо змінна не задана, залишаємо localhost для розробки
  USERS_SERVICE: process.env.REACT_APP_USERS_SERVICE || "http://localhost:3000",
  SONGS_SERVICE: process.env.REACT_APP_SONGS_SERVICE || "http://localhost:1000",
  UI_URL_PREFIX: process.env.REACT_APP_UI_URL_PREFIX || "",
  GOOGLE_AUTH_URL:
    process.env.REACT_APP_GOOGLE_AUTH_URL ||
    "http://localhost:1000/oauth2/authorization/google",
};

export default config;
