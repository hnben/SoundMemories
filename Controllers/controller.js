import db from '../Db/db.js'

const getFiltered = async (req, res) => {
    const filter = req.params.filter;
    res.send(await db.getFiltered(filter));
}

export default{
    getFiltered
}