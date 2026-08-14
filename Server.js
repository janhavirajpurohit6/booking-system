const express = require("express");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("Booking System API is running. Try GET /api/flights");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});