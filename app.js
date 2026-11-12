import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const PORT = 3008;

const pool = mysql2.createPool({
    // These values come from the .env file
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

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
    res.render('confirm');
});

// Save the submitted job with a timestamp, then show the confirmation page
app.post('/submit-job', async(req, res) => {
    try {
        const job = req.body;

        const sql = `INSERT INTO active_postings 
                     (jobTitle, company, trade, location, type, hours, posted, exp, appLink) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;


        // Create an array of parameters for each ? placeholder in order
        const params = [
            job.title,
            job.company,
            job.tradeArea,
            job.location,
            job.jobType,
            job.hourType,
            job.postDate,
            job.expirationDate,
            job.applicationUrl
        ];


        // Execute the query with the parameters
        const [result] = await pool.execute(sql, params);

        const [jobs] = await pool.query('SELECT * FROM active_postings');
        res.render('confirm', {jobs});

    } catch(err) {
        // If ANYTHING goes wrong, this runs
        console.error('Error inserting submission:', err);
    }
});

app.get('/jobs', async(req, res) => {
    const [jobs] = await pool.query('SELECT * FROM active_postings');
    res.render('jobs', {jobs});
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});