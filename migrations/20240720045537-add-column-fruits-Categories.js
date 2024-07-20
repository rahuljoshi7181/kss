'use strict'

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

exports.up = function (db, callback) {
    db.addColumn(
        'fruit_categories',
        'name_hindi',
        {
            type: 'string',
            length: 255, // Example length, adjust as needed
            notNull: false, // Example constraint, adjust as needed
        },
        callback
    )
}

exports.down = function (db) {
    return null
}

exports._meta = {
    version: 1,
}
