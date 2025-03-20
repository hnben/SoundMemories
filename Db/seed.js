//insert dummy data
export function plantSeeds(db) {
    const seedData = [
      `INSERT OR IGNORE INTO users(username, pass, email) VALUES 
      ('cheeseman45', '$2b$10$0jtAoU.gsZ/Fjz0196DS1.IxbJU/oK28.YGmCej/oblOFsyHSAsQu', 'cheeseman45@email.com'),
      ('platopatriot', '$2b$10$gwXu28wp35nfO3lc0YT6oOv5jzfEdHzX4ueQTFIDyqk9gdtKxRqwq', 'plpat@123.com'),
      ('panda_lover_222222', '$2b$10$YvF/Z8gMScUcgj0pq2nheeizSa2jSCYdR8ZW6BJaH8XyZgJm/VqNy', 'amanda@healthbank.org'),
      ('jdavies', '$2b$10$5uecNWx1rZeFowD5NOQ4nOjOEtfXdRvBuCMCIxxjrJFRizD5esMZO', 'jonatan.davies@school.edu'),
      ('user123fortynine', '$2b$10$E2l..GydByZaUxU1NT3xFuHEpIJvfkOJWKal681.lxOh9nZ.fargq', 'pizzaplacesnearme@hungrymail.com');`,
  
      `INSERT OR IGNORE INTO audio_files(FK_userID, file_name, file_path, file_desc, uploaded_at, sender, is_external) VALUES
      (1, 'encouraging.mp3', 'Files/encouraging.mp3', 'An encouraging message of support from your buddy David', datetime('now'), 'David Jarvis', 0),
      (1, 'happy.mp3', 'Files/happy.mp3', 'An uplifting message from Grandma Pam', datetime('now'), 'Grandma Pam', 0),
      (1, 'random.mp3', 'Files/random.mp3', 'A funny soundbyte from your older brother Joe', datetime('now'), 'Joe Schmoe', 0),
      (1, 'sad.mp3', 'Files/sad.mp3', 'Something to listen to when you''re feeling blue', datetime('now'), 'Mom', 0);`,
  
      `INSERT OR IGNORE INTO tags(tag_name) VALUES 
      ('encouraging'),
      ('happy'),
      ('random'),
      ('sad');`,
  
      `INSERT OR IGNORE INTO audio_file_tags(FK_audio_id, FK_tag_id) VALUES 
      (1, 1),
      (2, 2),
      (3, 3),
      (4, 4);`
    ];
  
    //this should only run if the database is empty!
    if (db.prepare(`SELECT COUNT(*) AS count FROM users`).get().count === 0) {
        seedData.forEach(query => {
            db.prepare(query).run();
          });
    }
    //probably a more robust way of checking for this...

    console.log("Database seed data initialized.");
}