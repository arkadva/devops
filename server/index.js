import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'students_gyic_user',
  host: 'dpg-chu8un67avj345amvqm0-a.frankfurt-postgres.render.com',
  database: 'students_gyic',
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.query(`
  CREATE TABLE IF NOT EXISTS student_scores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    score1 INTEGER NOT NULL,
    score2 INTEGER NOT NULL,
    score3 INTEGER NOT NULL
  );
`)
  .then(() => {
    console.log('Table "student_scores" created successfully or already exists');
  })
  .catch((error) => {
    console.error('Error creating table:', error);
  });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// express server
const port = process.env.PORT || 3001;
const app = express();

app.use(bodyParser.json()); // Parse JSON data
app.use(express.static(path.join(__dirname, '../build')));

app.listen(port, () => {
  console.log(`Server is up and running at port: ${port}`);
});

app.post('/upload', (req, res) => {
  const { name, scores } = req.body;
  
  pool.query(
    'INSERT INTO student_scores (name, score1, score2, score3) VALUES ($1, $2, $3, $4)',
    [name, scores[0], scores[1], scores[2]],
    (error, results) => {
      if (error) {
        console.error('Error inserting data into the database:', error);
        res.status(500).json({ error: 'Error inserting data into the database' });
      } else {
        console.log('Data inserted into the database');
        res.status(200).json({ message: 'Data inserted successfully' });
      }
    }
  );
});

// Endpoint to retrieve entries from the PostgreSQL database
app.get('/entries', (req, res) => {
  pool
    .query('SELECT * FROM student_scores')
    .then((result) => {
      const entries = result.rows;
      res.status(200).json(entries);
    })
    .catch((error) => {
      console.error('Error retrieving entries from the database:', error);
      res.status(500).json({ message: 'An error occurred while retrieving entries from the database' });
    });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});