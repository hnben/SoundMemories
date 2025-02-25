// controllers/contributeController.js
import generateUniqueLink from '../utils/generateLink.js';

export const createContributionRequest = (req, res) => {
    try {
        const uniqueLink = generateUniqueLink();
        res.status(201).json({ success: true, link: uniqueLink });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating request' });
    }
};