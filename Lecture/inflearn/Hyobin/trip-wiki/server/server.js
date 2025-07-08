const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// 디버깅용 경로 출력
console.log("▶ __dirname:", __dirname);
console.log("▶ path.join(__dirname, '..'):", path.join(__dirname, '..'));
console.log("▶ index.html 경로:", path.join(__dirname, "..", "index.html"));

app.use(express.static(path.join(__dirname, "..")));
app.get("*trip", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.listen(port, () => {
    console.log("Start Server" + port);
});

