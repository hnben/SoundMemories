import fs from 'fs/promises';

const getFiltered = async (filter) => {
    const recordingList = JSON.parse(await fs.readFile('./Files/text.json', 'utf-8'));
    const filteredList = recordingList.filter(recording => recording.id === filter);
    return filteredList;
}

export default{
    getFiltered
}