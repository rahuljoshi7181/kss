const executeQuery = async (query, params, db) => {
    try {
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

const getRecordsCount = async (options) => {
    const {
        table,
        order_by = 'desc',
        order_by_column = 'id',
        connection,
        joins = [],
        where,
    } = options
    const joinString = joins
        .map((join) => {
            const { type = 'INNER', table: joinTable, on } = join
            return `${type} JOIN ${joinTable} ON ${on}`
        })
        .join(' ')
    const whereCondition = where ? ` WHERE ${where} ` : ''
    const query = `SELECT count(${table}.id) FROM ${table} ${joinString}${whereCondition} order by ${order_by_column} ${order_by}`
    return executeQuery(query, '', connection)
}

const getRecords = async (options) => {
    const {
        table,
        columns,
        order_by = 'desc',
        order_by_column = 'id',
        limit,
        offset,
        connection,
        joins = [],
        pagination = false,
        where = '',
    } = options

    const columnsString = columns
        .map((col) => {
            // Check if the column requires concatenation
            if (col.concat) {
                // Use CONCAT_WS for concatenating first_name, middle_name, and last_name
                return `CONCAT_WS(' ', ${col.concat.join(', ')}) AS ${col.alias}`
            } else {
                // Standard column selection with alias
                return `${col.name} AS ${col.alias}`
            }
        })
        .join(', ')
    const joinString = joins
        .map((join) => {
            const { type = 'INNER', table: joinTable, on } = join
            return `${type} JOIN ${joinTable} ON ${on}`
        })
        .join(' ')
    const order = ` order by ${order_by_column} ${order_by}`
    const _offset = pagination ? ` OFFSET ${offset}` : ''
    const whereCondition = where ? ` WHERE ${where} ` : ''
    const query_limit = limit ? `LIMIT ${limit}` : ''
    const query = `SELECT ${columnsString} FROM ${table} ${joinString}${whereCondition} ${order} ${query_limit} ${_offset}`
    console.log(query)
    return executeQuery(query, '', connection)
}

module.exports = {
    insertRecord,
    updateRecord,
    getRecordById,
    getAllRecords,
    getRecords,
    getRecordsCount,
}
