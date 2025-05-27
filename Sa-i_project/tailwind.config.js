module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    {
      pattern: /.*/, // 🔥 모든 클래스 보호
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
