const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5173;

app.use(
  createProxyMiddleware({
    pathFilter: "/api",
    target: "https://mern-backend-buiducphat0409.onrender.com",
    changeOrigin: true,
  }),
);

app.use(express.static(path.join(__dirname, "dist")));

app.use((req, res, next) => {
  if (req.method !== "GET") return next();
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Frontend và API Proxy đang chạy tại port ${PORT}`);
});
