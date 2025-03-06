import mysql from 'mysql2/promise';

// Create MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',  
    user: 'hxben',       // Change to your MySQL username
    password: 'Hello123', // Change to your password
    database: 'chiliOil', // Change to your db name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Fetch all audio files
const getAll = async () => {
    const [rows] = await pool.query("SELECT * FROM audio_files");
    return rows;
};

// Fetch audio files by tag
const getFiltered = async (tagName) => {
    const query = `
        SELECT af.*
        FROM audio_files af
        JOIN audio_file_tags aft ON af.id = aft.FK_audio_id
        JOIN tags t ON aft.FK_tag_id = t.id
        WHERE t.tag_name = ?;
    `;
    const [rows] = await pool.query(query, [tagName]);
    return rows;
};

// Fetch an audio file by its ID
const getById = async (audioId) => {
    const [rows] = await pool.query("SELECT * FROM audio_files WHERE id = ?", [audioId]);
    return rows[0];  // Only one result is expected
};

// Insert a new audio file
const uploadAudio = async (userID, fileName, filePath, fileDesc, sender, isExternal, externalSource, externalFileUrl) => {
    const query = `
        INSERT INTO audio_files (FK_userID, file_name, file_path, file_desc, uploaded_at, sender, is_external, external_source, external_file_url)
        VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?);
    `;
    const [result] = await pool.query(query, [userID, fileName, filePath, fileDesc, sender, isExternal, externalSource, externalFileUrl]);
    return result.insertId;
};

// Delete an audio file
const deleteAudio = async (audioId) => {
    // Remove the tag associations first
    await pool.query(`DELETE FROM audio_file_tags WHERE FK_audio_id = ?`, [audioId]);
    // Then delete the audio file itself
    await pool.query(`DELETE FROM audio_files WHERE id = ?`, [audioId]);
};

// Fetch all tags
const getTags = async () => {
    const [rows] = await pool.query("SELECT * FROM tags");
    return rows;
};

// Get tags assigned to a specific audio file
const getTagsByAudioId = async (audioId) => {
    const query = `
        SELECT t.tag_name 
        FROM tags t
        JOIN audio_file_tags aft ON t.id = aft.FK_tag_id
        WHERE aft.FK_audio_id = ?;
    `;
    const [rows] = await pool.query(query, [audioId]);
    return rows;
};

// Insert a new tag or get the existing one
const addTag = async (tagName) => {
    const query = `INSERT INTO tags (tag_name) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id);`;
    const [result] = await pool.query(query, [tagName]);
    return result.insertId;
};

// Link an audio file with a tag
const assignTag = async (audioId, tagId) => {
    const query = `INSERT INTO audio_file_tags (FK_audio_id, FK_tag_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE FK_audio_id=FK_audio_id;`;
    await pool.query(query, [audioId, tagId]);
};

// Remove a tag from an audio file
const removeTag = async (audioId, tagId) => {
    await pool.query("DELETE FROM audio_file_tags WHERE FK_audio_id = ? AND FK_tag_id = ?", [audioId, tagId]);
};

// Fetch all audio files matching a given tag name
const getAudioFilesByTagName = async (tagName) => {
    const query = `
        SELECT af.* 
        FROM audio_files af
        JOIN audio_file_tags aft ON af.id = aft.FK_audio_id
        JOIN tags t ON aft.FK_tag_id = t.id
        WHERE t.tag_name = ?;
    `;
    const [rows] = await pool.query(query, [tagName]);
    return rows;
};

// Database function to update audio file metadata
const updateAudio = async (fileId, fileName, fileDesc, sender, isExternal, externalSource, externalFileUrl) => {
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
        const [result] = await pool.query(query, values);

        // If no rows were updated, return null (audio file not found)
        if (result.affectedRows === 0) {
            return null;
        }

        // Fetch and return the updated audio file
        const updatedFileQuery = 'SELECT * FROM audio_files WHERE id = ?';
        const [updatedFile] = await pool.query(updatedFileQuery, [fileId]);

        return updatedFile[0]; // Return the updated file record
    } catch (error) {
        console.error("Error updating audio file:", error);
        throw new Error("Failed to update audio file.");
    }
};

// Export all functions
export default {
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
    updateAudio
};