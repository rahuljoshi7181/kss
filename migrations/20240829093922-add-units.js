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
        .addColumn('fruit_categories', 'units', {
            type: 'int',
            length: 11,
            notNull: false,
        })
        .then(() => {
            return db.addColumn('city', 'name_hindi', {
                type: 'varchar', // or 'int', 'date', 'boolean', etc.
                length: 200, // optional, specify for VARCHAR or CHAR types
                notNull: false, // optional, specify if the column should be NOT NULL
                defaultValue: null, // optional, specify a default value
            })
        })
        .then(() => {
            return db.insert(
                'units',
                [
                    'primary_unit',
                    'secondary_unit',
                    'primary_unit_hindi',
                    'secondary_unit_hindi',
                    'description',
                ],
                ['Tone', 'Nug', 'टन', 'नग़', '1 fruit']
            )
        })
        .then(() => {
            return db.insert(
                'units',
                [
                    'primary_unit',
                    'secondary_unit',
                    'primary_unit_hindi',
                    'secondary_unit_hindi',
                    'description',
                ],
                ['Kartoon', 'KG', 'कार्टून ', 'क़िलॊ', '']
            )
        })
}

exports.down = function (db) {
    return null
}

exports._meta = {
    version: 1,
}
