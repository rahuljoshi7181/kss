const { getRecords } = require('../models/db-common')
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

const getDataFromTable = async (table, connection) => {
    let columns = [
        { name: `${table}.id`, alias: 'id' },
        { name: `${table}.name`, alias: 'name' },
    ]

    const rows = await getRecords({
        table,
        columns,
        order_by: 'desc',
        order_by_column: 'name',
        limit: 0,
        offset: 0,
        connection,
        joins: [],
        pagination: false,
        where: '',
    })

    return rows
}

module.exports = {
    pagination,
    getDataFromTable,
}
