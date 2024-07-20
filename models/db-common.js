const executeQuery = async (query, params, db) => {
    try {
        console.log('HELLO', 'sss')
        const [results] = await db.execute(query, params)
        return results
    } catch (err) {
        console.error('Database Error:', err)
        throw new Error('Database operation failed')
    }
}

const insertRecord = async (table, data, connection) => {
    const columns = Object.keys(data).join(', ')
    const values = Object.values(data)
    const placeholders = values.map(() => '?').join(', ')
    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`
    return executeQuery(query, values, connection)
}

const updateRecord = async (table, data, idColumn, id, connection) => {
    const columns = Object.keys(data)
        .map((key) => `${key} = ?`)
        .join(', ')
    const values = [...Object.values(data), id]

    const query = `UPDATE ${table} SET ${columns} WHERE ${idColumn} = ?`
    return executeQuery(query, values, connection)
}

const getRecordById = async (table, idColumn, id, connection) => {
    const query = `SELECT * FROM ${table} WHERE ${idColumn} = ?`
    return executeQuery(query, [id], connection)
}

const getAllRecords = async (table, connection) => {
    const query = `SELECT * FROM ${table}`
    return executeQuery(query, '', connection)
}

module.exports = {
    insertRecord,
    updateRecord,
    getRecordById,
    getAllRecords,
}
