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
        .insert('city', ['name', 'state_id'], ['Kota', 1])
        .then(() => {
            return db.insert('city', ['name', 'state_id'], ['Bundi', 1])
        })
        .then(() => {
            return db.insert('city', ['name', 'state_id'], ['Baran', 1])
        })
        .then(() => {
            return db.insert('city', ['name', 'state_id'], ['Jhalawar', 1])
        })
}

exports.down = function (db) {
    return null
}

exports._meta = {
    version: 1,
}
