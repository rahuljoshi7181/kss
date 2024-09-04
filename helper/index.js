const { getRecords } = require('../models/db-common')
const R = require('ramda')
const { isNotEmpty, removeBlankSpaces } = require('../constants')
const pagination = (totalItems, currentPage = 1, itemsPerPage = 10) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    currentPage = Math.max(1, Math.min(currentPage, totalPages))

    const from = (currentPage - 1) * itemsPerPage + 1
    const to = Math.min(from + itemsPerPage - 1, totalItems)

    const pagination = {
        page: currentPage,
        first_page_url: `/?page=1`,
        from: from,
        last_page: totalPages,
        links: [],
        next_page_url:
            currentPage < totalPages ? `/?page=${currentPage + 1}` : null,
        items_per_page: itemsPerPage.toString(),
        prev_page_url: currentPage > 1 ? `/?page=${currentPage - 1}` : null,
        to: to,
        total: totalItems,
    }

    // Create pagination links
    if (currentPage > 1) {
        pagination.links.push({
            url: pagination.prev_page_url,
            label: '&laquo; Previous',
            active: false,
            page: currentPage - 1,
        })
    } else {
        pagination.links.push({
            url: null,
            label: '&laquo; Previous',
            active: false,
            page: null,
        })
    }

    for (let i = 1; i <= totalPages; i++) {
        pagination.links.push({
            url: `/?page=${i}`,
            label: i.toString(),
            active: i === currentPage,
            page: i,
        })
    }

    if (currentPage < totalPages) {
        pagination.links.push({
            url: pagination.next_page_url,
            label: 'Next &raquo;',
            active: false,
            page: currentPage + 1,
        })
    } else {
        pagination.links.push({
            url: null,
            label: 'Next &raquo;',
            active: false,
            page: null,
        })
    }

    return {
        payload: {
            pagination: pagination,
        },
    }
}

const getDataFromTable = async (table, connection, setting) => {
    console.log(' *********************************************** ')
    let joins = ''
    let columns = [
        { name: `${table}.id`, alias: 'id' },
        { name: `${table}.name`, alias: 'name' },
    ]
    const settingsObject = isNotEmpty(setting) ? JSON.parse(setting) : ''
    if (settingsObject != '' && isNotEmpty(settingsObject.join)) {
        let joinParts = settingsObject.join.split(' ')
        joins = [
            {
                type: joinParts[0],
                table: joinParts[2].split('=')[0].split('.')[0],
                on: joinParts[2],
            },
        ]
    }
    if (settingsObject != '' && isNotEmpty(settingsObject.column)) {
        let columnsArray = settingsObject.column.split(',')
        columns = columnsArray.map((col) => {
            if (col.includes('CONCAT')) {
                const removeConcat = R.compose(
                    R.replace('CONCAT(', ''),
                    R.replace(')', '')
                )
                let concatPart = removeConcat(col).split('as')
                console.log(concatPart, 'concatPart')
                return {
                    concat: removeBlankSpaces(concatPart[0].split(' ')),
                    alias: concatPart[1],
                }
            } else {
                return {
                    name: col,
                    alias: col.includes('.') ? col.split('.')[1] : col,
                }
            }
        })
    }
    console.log(columns, ' columns ')

    const rows = await getRecords({
        table,
        columns,
        order_by: 'asc',
        order_by_column: settingsObject.order_by,
        limit: 0,
        offset: 0,
        connection,
        joins: joins,
        pagination: false,
        where: '',
    })

    return rows
}

module.exports = {
    pagination,
    getDataFromTable,
}
