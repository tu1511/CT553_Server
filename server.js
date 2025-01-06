require("dotenv").config();

const app = require("./src/app");

const PORT = process.env.PORT || 5000;

app.get("/check", (_, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
  });
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
