import app from "./src/app.js";

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Crm Service is running");
});

app.listen(PORT, () => {
  console.log(`CRM Service running on port ${PORT}`);
});
