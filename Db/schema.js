export function initalizeSchema(db) {
    //schema definition
    const pragma = `PRAGMA foreign_keys = ON;`;
    db.prepare(pragma).run();
    
    const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY NOT NULL,  -- Auto-increments automatically
    username TEXT UNIQUE NOT NULL,
    pass TEXT NOT NULL,       -- Stored hash
    email TEXT UNIQUE NOT NULL
    );`;
    db.prepare(createUsersTable).run();

    const createAudioFilesTable = `CREATE TABLE IF NOT EXISTS audio_files (
    id INTEGER PRIMARY KEY NOT NULL,
    FK_userID INTEGER,
    file_name TEXT NOT NULL,
    file_path TEXT,           -- Local file path
    file_desc TEXT,
    uploaded_at TEXT NOT NULL, -- Store as ISO-8601 string (e.g., '2025-03-11T12:00:00')
    sender TEXT,
    is_external INTEGER NOT NULL, -- 0 = false, 1 = true
    external_source TEXT,     -- E.g., Google Drive, Dropbox
    external_file_id INTEGER UNIQUE, 
    external_file_url TEXT,
    FOREIGN KEY (FK_userID) REFERENCES users(id) ON DELETE CASCADE
    );`;
    db.prepare(createAudioFilesTable).run();

    const createTagsTable = `CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY NOT NULL,
    tag_name TEXT UNIQUE
    );`;
    db.prepare(createTagsTable).run();

    const createAudioFileTagsTable = `CREATE TABLE IF NOT EXISTS audio_file_tags (
    FK_audio_id INTEGER,
    FK_tag_id INTEGER,
    FOREIGN KEY (FK_audio_id) REFERENCES audio_files(id) ON DELETE CASCADE,
    FOREIGN KEY (FK_tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (FK_audio_id, FK_tag_id)
    );`;
    db.prepare(createAudioFileTagsTable).run();

    const createLinksTable = `CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    links TEXT NOT NULL
    );`;
    db.prepare(createLinksTable).run();
}