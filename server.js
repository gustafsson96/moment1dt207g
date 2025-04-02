const express = require('express')
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about', {name: "Julia"});
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});