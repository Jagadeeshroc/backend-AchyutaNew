const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./userInfo.db', (err) => {
    if (err) {
        console.error('Database opening error: ', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

function initDB() {
    db.prepare(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`).run();

    db.run(`
        CREATE TABLE IF NOT EXISTS jobs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          company TEXT NOT NULL,
          location TEXT,
          description TEXT,
          requirements TEXT,
          salary TEXT,
          posted_by INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          status TEXT DEFAULT 'applied', -- Add status column with default value
          FOREIGN KEY (posted_by) REFERENCES users(id)
        )
      `);

    db.prepare(`CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT,
        rating INTEGER CHECK(rating >= 1 AND rating <= 5),
        job_id INTEGER,
        user_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(job_id) REFERENCES jobs(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`).run();
};

module.exports = { db, initDB };