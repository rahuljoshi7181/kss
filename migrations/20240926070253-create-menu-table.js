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
        '20240926070253-create-menu-table-up.sql'
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
                'menu',
                [
                    'id',
                    'menu_name',
                    'menu_category',
                    'url',
                    'parent_menu_id',
                    'icon',
                    'display_order',
                    'is_active',
                ],
                [
                    '1',
                    'User Listing',
                    'website',
                    '/user/listing',
                    null,
                    null,
                    '1',
                    true,
                ]
            )
        })
        .then(() => {
            return db.insert(
                'menu',
                [
                    'id',
                    'menu_name',
                    'menu_category',
                    'url',
                    'parent_menu_id',
                    'icon',
                    'display_order',
                    'is_active',
                ],
                [
                    '2',
                    'Add User',
                    'website',
                    '/user/add-user',
                    '1',
                    null,
                    '2',
                    true,
                ]
            )
        })
        .then(() => {
            return db.insert(
                'menu',
                [
                    'id',
                    'menu_name',
                    'menu_category',
                    'url',
                    'parent_menu_id',
                    'icon',
                    'display_order',
                    'is_active',
                ],
                [
                    '3',
                    'Update User',
                    'website',
                    '/user/update-user',
                    '1',
                    null,
                    '3',
                    true,
                ]
            )
        })
        .then(() => {
            return db.insert(
                'menu',
                [
                    'id',
                    'menu_name',
                    'menu_category',
                    'url',
                    'parent_menu_id',
                    'icon',
                    'display_order',
                    'is_active',
                ],
                [
                    '4',
                    'Lead Listing',
                    'website',
                    '/lead/listing',
                    null,
                    null,
                    '4',
                    true,
                ]
            )
        })
        .then(() => {
            return db.insert(
                'menu',
                [
                    'id',
                    'menu_name',
                    'menu_category',
                    'url',
                    'parent_menu_id',
                    'icon',
                    'display_order',
                    'is_active',
                ],
                [
                    '5',
                    'Add Lead',
                    'website',
                    '/lead/add-lead',
                    '4',
                    null,
                    '5',
                    true,
                ]
            )
        })
        .then(() => {
            return db.insert(
                'menu',
                [
                    'id',
                    'menu_name',
                    'menu_category',
                    'url',
                    'parent_menu_id',
                    'icon',
                    'display_order',
                    'is_active',
                ],
                [
                    '6',
                    'Update Lead',
                    'website',
                    '/lead/update-lead',
                    '4',
                    null,
                    '6',
                    true,
                ]
            )
        })
        .then(() => {
            return db.insert(
                'menu',
                [
                    'id',
                    'menu_name',
                    'menu_category',
                    'url',
                    'parent_menu_id',
                    'icon',
                    'display_order',
                    'is_active',
                ],
                [
                    '7',
                    'Price Listing',
                    'website',
                    '/local/price-listing',
                    null,
                    null,
                    '7',
                    true,
                ]
            )
        })
        .then(() => {
            return db.insert(
                'menu',
                [
                    'id',
                    'menu_name',
                    'menu_category',
                    'url',
                    'parent_menu_id',
                    'icon',
                    'display_order',
                    'is_active',
                ],
                [
                    '8',
                    'Save Prices',
                    'website',
                    '/local/save-prices',
                    '7',
                    null,
                    '8',
                    true,
                ]
            )
        })
        .then(() => {
            return db.insert(
                'menu',
                [
                    'id',
                    'menu_name',
                    'menu_category',
                    'url',
                    'parent_menu_id',
                    'icon',
                    'display_order',
                    'is_active',
                ],
                [
                    '9',
                    'Transport Listing',
                    'website',
                    '/transport/listing',
                    null,
                    null,
                    '9',
                    true,
                ]
            )
        })
        .then(() => {
            return db.insert(
                'menu',
                [
                    'id',
                    'menu_name',
                    'menu_category',
                    'url',
                    'parent_menu_id',
                    'icon',
                    'display_order',
                    'is_active',
                ],
                [
                    '10',
                    'Add Transport Company',
                    'website',
                    '/transport/add',
                    '9',
                    null,
                    '10',
                    true,
                ]
            )
        })
        .then(() => {
            return db.insert(
                'menu',
                [
                    'id',
                    'menu_name',
                    'menu_category',
                    'url',
                    'parent_menu_id',
                    'icon',
                    'display_order',
                    'is_active',
                ],
                [
                    '11',
                    'Edit Transport Company',
                    'website',
                    '/transport/edit',
                    '9',
                    null,
                    '11',
                    true,
                ]
            )
        })
        .then(() => {
            return db.insert(
                'menu',
                [
                    'id',
                    'menu_name',
                    'menu_category',
                    'url',
                    'parent_menu_id',
                    'icon',
                    'display_order',
                    'is_active',
                ],
                [
                    '12',
                    'Purchase Listing',
                    'website',
                    '/purchase/listing',
                    null,
                    null,
                    '12',
                    true,
                ]
            )
        })
        .then(() => {
            return db.insert(
                'menu',
                [
                    'id',
                    'menu_name',
                    'menu_category',
                    'url',
                    'parent_menu_id',
                    'icon',
                    'display_order',
                    'is_active',
                ],
                [
                    '13',
                    'Add Purchase',
                    'website',
                    '/purchase/add-purchase',
                    '12',
                    null,
                    '13',
                    true,
                ]
            )
        })
        .then(() => {
            return db.addColumn('users', 'role', {
                type: 'varchar',
                notNull: false,
                defaultValue: 0,
            })
        })
        .then(() => {
            return db.addColumn('users', 'is_admin', {
                type: 'tinyint',
                notNull: true,
                defaultValue: 0,
            })
        })
}

exports.down = function (db) {
    var filePath = path.join(
        __dirname,
        'sqls',
        '20240926070253-create-menu-table-down.sql'
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
