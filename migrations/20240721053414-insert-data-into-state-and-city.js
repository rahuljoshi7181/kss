'use strict'
/* eslint-disable */
var dbm
var type
var seed

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate
    type = dbm.dataType
    seed = seedLink
}

exports.up = function (db) {
    return db
        .insert('state', ['id', 'name', 'abbreviation'], [1, 'Rajasthan', 'RJ'])
        .then(() => {
            return db.insert(
                'state',
                ['id', 'name', 'abbreviation'],
                [2, 'Gujrat', 'GJ']
            )
        })
        .then(() => {
            return db.insert(
                'state',
                ['id', 'name', 'abbreviation'],
                [3, 'Karnatka', 'KA']
            )
        })
}

exports.down = function (db) {
    return null
}

exports._meta = {
    version: 1,
}
