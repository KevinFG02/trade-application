import express from 'express';

const app = express();

const PORT = 3008;

const jobs = [];

app.use(express.static('public'));

app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/add-job', (req, res) => {
    res.render('add-job');
});

app.get('/confirm', (req, res) => {
    res.render('confirm');
});

app.post('/submit-job', (req, res) => {
    const job = req.body;
    job['timestamp'] = new Date();

    jobs.push(job);

    res.render('confirm', {job});
});

app.get('/jobs', (req, res) => {
    res.render('jobs', {jobs});
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});