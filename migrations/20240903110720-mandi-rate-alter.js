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
        .addColumn('daily_fruit_rates', 'user_id', {
            type: 'int',
            length: 11,
            notNull: false,
        })
        .then(() => {
            return db.addColumn('daily_fruit_rates', 'updated_by', {
                type: 'int', // or 'int', 'date', 'boolean', etc.
                length: 11, // optional, specify for VARCHAR or CHAR types
                notNull: false, // optional, specify if the column should be NOT NULL
                defaultValue: null, // optional, specify a default value
            })
        })
        .then(() => {
            return db.addColumn('follow_ups', 'created_by', {
                type: 'int', // or 'int', 'date', 'boolean', etc.
                length: 11, // optional, specify for VARCHAR or CHAR types
                notNull: false, // optional, specify if the column should be NOT NULL
                defaultValue: null, // optional, specify a default value
            })
        })
}

exports.down = function (db) {
    return null
}

exports._meta = {
    version: 1,
}
