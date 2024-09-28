'use strict'
/* eslint-disable */
var dbm
var type
var seed
var fs = require('fs')
var path = require('path')
var Promise

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate
    type = dbm.dataType
    seed = seedLink
    Promise = options.Promise
}

exports.up = function (db) {
    var filePath = path.join(
        __dirname,
        'sqls',
        '20240926061715-create-setting-table-up.sql'
    )
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
            if (err) return reject(err)
            console.log('received data: ' + data)

            resolve(data)
        })
    })
        .then(function (data) {
            return db.runSql(data)
        })
        .then(() => {
            return db.insert(
                'common_settings',
                ['setting_key', 'setting_value', 'setting_type'],
                [
                    'roles_json',
                    `{
                  "roles": {
                    "executive": {
                      "permissions": [
                        {
                          "page_id": "4",
                          "actions": ["read", "write", "update"]
                        },
                        {
                          "page_id": "7",
                          "actions": ["read", "write", "update"]
                        },
                        {
                          "page_id": "9",
                          "actions": ["read"]
                        }
                      ]
                    }
                  }
                }`,
                    'json',
                ]
            )
        })
}

exports.down = function (db) {
    var filePath = path.join(
        __dirname,
        'sqls',
        '20240926061715-create-setting-table-down.sql'
    )
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
            if (err) return reject(err)
            console.log('received data: ' + data)

            resolve(data)
        })
    }).then(function (data) {
        return db.runSql(data)
    })
}

exports._meta = {
    version: 1,
}
