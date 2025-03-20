import Database from 'better-sqlite3';
import { initalizeSchema } from './schema.js';
import { plantSeeds } from './seed.js';

// Create SQLite connection
const db = new Database('audio.sqlite', {
    //logs to an output stream
    verbose: console.log
  });

//set up the database
initalizeSchema(db);
plantSeeds(db);

const createContributionRequest = (link) => {
    const insertQuery = 'INSERT INTO generated_links (link) VALUES (?);';
    const selectQuery = 'SELECT link FROM generated_links WHERE id = ?;';

    const statement = db.prepare(insertQuery);

    //run the INSERT statement
    const result = statement.run(link);

    //get the new link out of the DB
    const row = db.prepare(selectQuery).get(result.lastInsertRowid);

    //if the row exists, return the link
    if (row) {
        return row.link;
    }
    else {
        return null;
    }
};

// Fetch all audio files
const getAll = () => {
    const statement = db.prepare("SELECT * FROM audio_files");
    return statement.all();
};

// Fetch audio files by tag
const getFiltered = (tagName) => {
    const query = `
        SELECT af.*
        FROM audio_files af
        JOIN audio_file_tags aft ON af.id = aft.FK_audio_id
        JOIN tags t ON aft.FK_tag_id = t.id
        WHERE t.tag_name = ?;
    `;

    const statement = db.prepare(query);
    return statement.all(tagName);
};

// Fetch an audio file by its ID
const getById = (audioId) => {
    const query = "SELECT * FROM audio_files WHERE id = ?";

    //.get() for one row. .all() for multiple. Remember that.
    const row = db.prepare(query).get(audioId);

    //if the row exists, return it, if not, NULL
    return row || null;
};

// Insert a new audio file
const uploadAudio = (userID, fileName, filePath, fileDesc, sender, isExternal, externalSource, externalFileUrl) => {
    const query = `
        INSERT INTO audio_files (FK_userID, file_name, file_path, file_desc, uploaded_at, sender, is_external, external_source, external_file_url)
        VALUES (?, ?, ?, ?, datetime('now'), ?, ?, ?, ?);
    `;

    const statement = db.prepare(query);
    const result = statement.run(userID, fileName, filePath, fileDesc, sender, isExternal, externalSource, externalFileUrl);

    //lastInsertRowid works the same as insertId in MySQL
    return result.lastInsertRowid;
};


//delete the audio files with associated ID
const deleteAudio = (audioId) => {
    const query = `DELETE FROM audio_files WHERE id = ?`;

    const statement = db.prepare(query);
    const result = statement.run(audioId);

    //`changes` is the number of rows affected by the DELETE query
    return result.changes;
};

// Fetch all tags
const getTags = () => {
    const statement = db.prepare("SELECT * FROM tags");

    //similar functionality to getAll, still returning an array of objects
    return statement.all();
};

// Get tags assigned to a specific audio file
const getTagsByAudioId = (audioId) => {
    const query = `
        SELECT t.tag_name 
        FROM tags t
        JOIN audio_file_tags aft ON t.id = aft.FK_tag_id
        WHERE aft.FK_audio_id = ?;
    `;

    const statement = db.prepare(query);
    const rows = statement.all(audioId);

    /*tag_name is the field for these objects;
        [
            {"tag_name": "happy"},
            {"tag_name": "sad"},
            etc...    
        ]
    */
    return rows;
};


// Insert a new tag or get the existing one
const addTag = (tagName) => {
    //INSERT OR REPLACE INTO serves as a replacement for the ON DUPLICATE KEY UPDATE constraint
    const query = `
        INSERT OR REPLACE INTO tags (id, tag_name)
        VALUES (
            (SELECT id FROM tags WHERE tag_name = ? LIMIT 1), 
            ?
        );
    `;

    const statement = db.prepare(query);
    const result = statement.run(tagName, tagName);
    return result.lastInsertRowid;
};


// Link an audio file with a tag in SQLite
const assignTag = (audioId, tagId) => {
    const query = `
        INSERT OR IGNORE INTO audio_file_tags (FK_audio_id, FK_tag_id)
        VALUES (?, ?);
    `;
    db.prepare(query).run(audioId, tagId);
};


// Remove a tag from an audio file
const removeTag = (audioId, tagId) => {
    const query = `
        DELETE FROM audio_file_tags
        WHERE FK_audio_id = ? AND FK_tag_id = ?;
    `;
    const statement = db.prepare(query);
    statement.run(audioId, tagId);
};

// Fetch all audio files matching a given tag name
const getAudioFilesByTagName = (tagName) => {
    const query = `
        SELECT af.* 
        FROM audio_files af
        JOIN audio_file_tags aft ON af.id = aft.FK_audio_id
        JOIN tags t ON aft.FK_tag_id = t.id
        WHERE t.tag_name = ?;
    `;
    
    const statement = db.prepare(query);
    return statement.all(tagName);
};

// Database function to update audio file metadata
const updateAudio = (fileId, fileName, fileDesc, sender, isExternal, externalSource, externalFileUrl) => {
    // Constructing the SET clause dynamically based on the provided data
    let setClause = '';
    let values = [];

    // Dynamically build the setClause and values array based on provided data
    if (fileName) {
        setClause += 'file_name = ?, ';
        values.push(fileName);
    }
    if (fileDesc) {
        setClause += 'file_desc = ?, ';
        values.push(fileDesc);
    }
    if (sender) {
        setClause += 'sender = ?, ';
        values.push(sender);
    }
    if (isExternal !== undefined) {
        setClause += 'is_external = ?, ';
        values.push(isExternal);
    }
    if (externalSource) {
        setClause += 'external_source = ?, ';
        values.push(externalSource);
    }
    if (externalFileUrl) {
        setClause += 'external_file_url = ? ';
        values.push(externalFileUrl);
    }

    // Remove the trailing comma and space
    setClause = setClause.trim().replace(/,$/, '');

    // Append the WHERE clause with the fileId
    const query = `
        UPDATE audio_files
        SET ${setClause}
        WHERE id = ?;
    `;

    // Add fileId as the last value
    values.push(fileId);

    try {
        const statement = db.prepare(query);
        statement.run(...values);
    
        // Check if any rows were updated (i.e., affected)
        if (db.changes === 0) {
            return null; // No rows were updated, so return null
        }
    
        // Fetch and return the updated audio file
        const updatedFileQuery = 'SELECT * FROM audio_files WHERE id = ?';
        const updatedFileStatement = db.prepare(updatedFileQuery);
        const updatedFile = updatedFileStatement.get(fileId);
    
        return updatedFile || null; // Return the updated file record
    }
    catch (error) {
        console.error("Error updating audio file:", error);
        throw new Error("Failed to update audio file.");
    }
};

const updateTags = (audioId, tagId) => {
    try {
        // Run the update query
        const statement = db.prepare("UPDATE audio_file_tags SET FK_tag_id = ? WHERE FK_audio_id = ?");
        const result = statement.run(tagId, audioId);

        // Return the result to the controller
        return { success: result.changes > 0 };
    } catch (error) {
        console.error("Error updating tags:", error);
        throw error;  // Rethrow the error to be caught by the controller
    }
};


// Export all functions
export default {
    createContributionRequest,
    getAll,
    getFiltered,
    getById,
    uploadAudio,
    deleteAudio,
    getTags,
    getTagsByAudioId,
    addTag,
    assignTag,
    removeTag,
    getAudioFilesByTagName,
    updateAudio,
    updateTags
};