import express from "express";
const app = express();
const PORT = 3000;
app.get("/", (_, res) => {
    res.send("Campus Rush API");
});
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map