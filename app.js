import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
import session from 'express-session';

const app = express();

const PORT = 3008;

app.locals.isAdmin = false;

const pool = mysql2.createPool({
    // These values come from the .env file
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    dateStrings: true
}).promise();

// Serve CSS, scripts, and images from the public folder
app.use(express.static('public'));

// Read submitted form data into req.body
app.use(express.urlencoded({extended: true}));

// Set EJS as the view engine
app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }
}));

function requireLogin(req, res, next) {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Define routes for the application
app.get('/', (req, res) => {
    res.render('home');
});

// Add a route for the login page
app.get('/login', (req, res) => {
    res.render('login', { error: null });
})

app.post('/login', (req, res) => {
    
    const username = req.body.username;
    const password = req.body.password;

    if (username === process.env.ADMIN_USER &&
        password === process.env.ADMIN_PASSWORD) {

            req.session.loggedIn = true;
            app.locals.isAdmin = true;

            res.redirect('/');
    } else {
        res.render('login', { error: 'Invalid username or password'});
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        app.locals.isAdmin = false;
        res.redirect('/');
    });
});

// Render the add-job page
app.get('/add-job', requireLogin, (req, res) => {
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

        res.render('confirm', { job });
        //const [jobs] = await pool.query('SELECT * FROM active_postings');
        //res.render('confirm', {jobs});

    } catch(err) {
        // If ANYTHING goes wrong, this runs
        console.error('Error inserting submission:', err);
    }
});

app.get('/jobs', async (req, res) => {
    try {
        const [jobs] = await pool.query(
            `SELECT * FROM active_postings
            WHERE exp >= CURDATE()
             ORDER BY posted DESC`
        );
        res.render('jobs', { jobs });
    } catch (err) {
        console.error('Error loading jobs:', err);
        res.status(500).send('Sorry, we could not load the job listings. Please try again later.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});