import db from '../Db/db.js';

// Get all audio files
const getAll = async (req, res) => {
    try {
        const data = await db.getAll();
        if (!data || data.length === 0) {
            return res.status(404).json({ message: "No audio files found." });
        }
        res.status(200).json(data);
    } catch (error) {
        console.error("Error in getAll:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Get filtered audio files based on a tag
const getFiltered = async (req, res) => {
    try {
        const filter = req.params.filter;
        const list = await db.getFiltered(filter);

        if (!list || list.length === 0) {
            return res.status(404).json({ message: "No matching audio files found." });
        }

        res.status(200).json(list);
    } catch (error) {
        console.error("Error in getFiltered:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Get audio file by ID
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const file = await db.getById(id);

        if (!file) {
            return res.status(404).json({ message: "Audio file not found." });
        }

        res.status(200).json(file);
    } catch (error) {
        console.error("Error in getById:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Upload a new audio file
const uploadAudio = async (req, res) => {
    try {
        const { userId, fileName, filePath, fileDesc, sender, isExternal, externalSource, externalFileId, externalFileUrl } = req.body;
        const newFile = await db.uploadAudio(userId, fileName, filePath, fileDesc, sender, isExternal, externalSource, externalFileId, externalFileUrl);

        res.status(201).json({ message: "Audio file uploaded successfully.", newFile });
    } catch (error) {
        console.error("Error in uploadAudio:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Delete an audio file
const deleteAudio = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.deleteAudio(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Audio file not found or already deleted." });
        }

        res.status(200).json({ message: "Audio file deleted successfully." });
    } catch (error) {
        console.error("Error in deleteAudio:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Get all tags
const getTags = async (req, res) => {
    try {
        const tags = await db.getTags();
        res.status(200).json(tags);
    } catch (error) {
        console.error("Error in getTags:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Get tags for a specific audio file
const getTagsByAudioId = async (req, res) => {
    try {
        const { id } = req.params;
        const tags = await db.getTagsByAudioId(id);

        res.status(200).json(tags);
    } catch (error) {
        console.error("Error in getTagsByAudioId:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Assign a tag to an audio file
const assignTag = async (req, res) => {
    try {
        const { audioId, tagId } = req.body;
        await db.assignTag(audioId, tagId);
        res.status(200).json({ message: "Tag assigned successfully." });
    } catch (error) {
        console.error("Error in assignTag:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Remove a tag from an audio file
const removeTag = async (req, res) => {
    try {
        const { audioId, tagId } = req.body;
        await db.removeTag(audioId, tagId);
        res.status(200).json({ message: "Tag removed successfully." });
    } catch (error) {
        console.error("Error in removeTag:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

const getAudioFilesByTagName = async (req, res) => {
    try {
        const tagName = req.params.tagName;
        const audioFiles = await db.getAudioFilesByTagName(tagName);
        res.json(audioFiles);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving audio files by tag');
    }
};

// Update an existing audio file's metadata
const updateAudio = async (req, res) => {
    try {
        const { fileId, fileName, fileDesc, sender, isExternal, externalSource, externalFileUrl } = req.body;

        // Call the updateAudio function from the database
        const updatedFile = await db.updateAudio(fileId, fileName, fileDesc, sender, isExternal, externalSource, externalFileUrl);

        if (!updatedFile) {
            return res.status(404).json({ message: "Audio file not found or no changes made." });
        }

        res.status(200).json({
            message: "Audio file updated successfully.",
            updatedFile
        });
    } catch (error) {
        console.error("Error in updateAudio:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

const updateTags = async (req, res) => {
    try {
        const { audioId, tagId } = req.body;
        if (!audioId || !tagId) {
            return res.status(400).json({ error: "Missing required fields: audioId and tagId" });
        }

        const result = await db.updateTags(audioId, tagId);

        if (!result.success) {
            return res.status(404).json({ error: "No matching audio file found to update" });
        }

        res.status(200).json({ message: "Tags updated successfully" });
    } catch (error) {
        console.error("Error updating tags:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



export default {
    getAll,
    getFiltered,
    getById,
    uploadAudio,
    deleteAudio,
    getTags,
    getTagsByAudioId,
    assignTag,
    removeTag,
    getAudioFilesByTagName,
    updateAudio,
    updateTags
};
