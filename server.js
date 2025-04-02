const express = require('express')
const app = express();

app.get('/', function (req, res) {
    res.send('Hello world!');
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});