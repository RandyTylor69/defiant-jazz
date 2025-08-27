import express from "express";
import cors from "cors";
const PORT = 8000;
const app = express();
app.use(cors());

app.get("/api/imslp", async (req, res) => {
  try {
    const {q,offset =0} = req.query
    const r = await fetch(
      `https://imslp.org/api.php?action=query&list=search&format=json&srsearch=${encodeURIComponent(q)}&sroffset=${offset}&srlimit=200`
    );
    const data = await r.json();

    res.json(data);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

app.listen(PORT, () => console.log(`server is running on ${PORT}`));
