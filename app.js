import express from 'express';

const app = express();

const PORT = 3008;

// Jobs are stored in memory
const jobs = [];

// Serve CSS, scripts, and images from the public folder
app.use(express.static('public'));

// Read submitted form data into req.body
app.use(express.urlencoded({extended: true}));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Define routes for the application
app.get('/', (req, res) => {
    res.render('home');
});

// Render the login page
app.get('/login', (req, res) => {
    res.render('login');
});

// Render the add-job page
app.get('/add-job', (req, res) => {
    res.render('add-job');
});

// Render the confirmation page with the list of jobs
app.get('/confirm', (req, res) => {
    res.render('confirm', {jobs});
});

// Save the submitted job with a timestamp, then show the confirmation page
app.post('/submit-job', (req, res) => {
    const job = req.body;
    job['timestamp'] = new Date();

    jobs.push(job);

    res.render('confirm', {jobs});
});

app.get('/jobs', (req, res) => {
    res.render('jobs', {jobs});
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});