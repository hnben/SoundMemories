import controller from '../Controllers/controller.js';
import express from 'express';
import { uploadAudio, upload } from '../Controllers/uploadController.js'; 

const router = express.Router();

// Upload a generated link
// router.post('/contribute', controller.createContributionRequest);
// router.get('/contribution/:id', controller.getGeneratedLink)

//endpoints to do stuff with the database
// Get all audio files
router.get('/audio', controller.getAll);

// Get filtered audio files based on a tag
router.get('/audio/filter/:filter', controller.getFiltered);

// Get audio file by ID
router.get('/audio/:id', controller.getById);

// Upload a new audio file
router.post('/audio/upload', controller.uploadAudio);

// Delete an audio file
router.delete('/audio/:id', controller.deleteAudio);

// Get all tags
router.get('/tags', controller.getTags);

// Get tags for a specific audio file
router.get('/audio/:id/tags', controller.getTagsByAudioId);

// Assign a tag to an audio file
router.post('/audio/assign-tag', controller.assignTag);

// Remove a tag from an audio file
router.post('/audio/remove-tag', controller.removeTag);

// Get audio files by tag name
router.get('/audio/tag/:tagName', controller.getAudioFilesByTagName);

//upload audio files
router.post('/upload', upload.single('audio'), uploadAudio);

//update audio files data
router.put('/audio/update', controller.updateAudio);

//update tags 
router.put('/audio/update/tags', controller.updateTags);

export default router;