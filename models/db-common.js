const R = require('ramda')
const executeQuery = async (query, params, db) => {
    console.log(query, params)
    try {
        const [results] = await db.execute(query, params)
        return results
    } catch (err) {
        throw new Error('Database operation failed')
    }
}

const buildWhereClause = (whereObj) => {
    if (R.isEmpty(whereObj) || R.isNil(whereObj)) {
        return ''
    }
    const whereConditions = Object.keys(whereObj)
        .map((key) => {
            if (whereObj[key].not) {
                return `${key} != ?`
            }
            return `${key} = ?`
        })
        .join(' AND ')
    return ` WHERE ${whereConditions}`
}

const insertRecord = async (table, data, connection) => {
    const columns = Object.keys(data).join(', ')
    const values = Object.values(data)
    const placeholders = values.map(() => '?').join(', ')
    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`
    return executeQuery(query, values, connection)
}

const updateRecord = async (table, data, whereConditions, connection) => {
    const columns = Object.keys(data)
        .map((key) => `${key} = ?`)
        .join(', ')
    const values = [...Object.values(data)]
    const whereClause = Object.keys(whereConditions)
        .map((key) => `${key} = ?`)
        .join(' AND ')
    const whereValues = Object.values(whereConditions)
    const queryValues = [...values, ...whereValues]
    const query = `UPDATE ${table} SET ${columns} WHERE ${whereClause}`
    return executeQuery(query, queryValues, connection)
}

const getRecordById = async (table, whereObj, connection) => {
    const whereClause = buildWhereClause(whereObj)
    const query = `SELECT * FROM ${table}${whereClause}`
    const whereValues = Object.values(whereObj || {})
    console.log(query)
    return executeQuery(query, whereValues, connection)
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

    const columnsString =
        Array.isArray(columns) && columns.length > 0
            ? columns
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
            : ''

    const joinString =
        Array.isArray(joins) && joins.length > 0
            ? joins
                  .map((join) => {
                      const { type = 'INNER', table: joinTable, on } = join
                      return `${type} JOIN ${joinTable} ON ${on}`
                  })
                  .join(' ')
            : ''
    const order = ` order by ${order_by_column} ${order_by}`
    const _offset = pagination ? ` OFFSET ${offset}` : ''
    const whereCondition = where ? ` WHERE ${where} ` : ''
    const query_limit = limit ? `LIMIT ${limit}` : ''
    const query = `SELECT ${columnsString} FROM ${table} ${joinString}${whereCondition} ${order} ${query_limit} ${_offset}`
    return executeQuery(query, '', connection)
}

module.exports = {
    insertRecord,
    updateRecord,
    getRecordById,
    getAllRecords,
    getRecords,
    getRecordsCount,
    executeQuery,
}
