import db from '../Db/db.js'

const getFiltered = async (req, res) => {
    const filter = req.params.filter;
    const list = await db.getFiltered(filter);
    res.send(list);
}

const getAll = async (req, res) => {
    res.send(await db.getAll());
}

export default{
    getFiltered,
    getAll
}