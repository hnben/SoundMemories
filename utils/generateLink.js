// utils/generateLink.js
import { randomUUID } from 'crypto';

function generateUniqueLink() {
    return `https://yourapp.com/contribute/${randomUUID()}`;
}

export default generateUniqueLink;