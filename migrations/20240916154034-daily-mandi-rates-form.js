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
        .insert(
            'forms',
            ['id', 'form_title', 'tabing'],
            ['8', 'dailyPrice', '0']
        )
        .then(() => {
            return db.insert(
                'form_sections',
                ['id', 'form_id', 'section_title', 'sort_order'],
                ['9', '8', 'Daily Price', '1']
            )
        })
        .then(() => {
            return db.insert(
                'form_fields',
                [
                    'section_id',
                    'label',
                    'field_name',
                    'placeholder',
                    'field_type',
                    'required',
                    'disabled',
                    'sort_order',
                    'error_message',
                    'settings',
                    'options_source_table',
                ],
                [
                    '9',
                    'Fruit',
                    'fruit_id',
                    'Fruit',
                    'select',
                    '1',
                    '0',
                    '1',
                    'Please enter fruit',
                    '{"where":"","column":"fruit_categories.id,CONCAT(fruits.name fruit_categories.name) as name","order_by":"fruits.name","join":"INNER JOIN fruits.id=fruit_categories.fruit_id"}',
                    'fruit_categories',
                ]
            )
        })
        .then(() => {
            return db.insert(
                'form_fields',
                [
                    'section_id',
                    'label',
                    'field_name',
                    'placeholder',
                    'field_type',
                    'required',
                    'disabled',
                    'sort_order',
                    'error_message',
                    'options_source_table',
                    'settings',
                ],
                [
                    '7',
                    'City',
                    'city_id',
                    '',
                    'select',
                    '1',
                    '0',
                    '9',
                    'Please enter City',
                    'city',
                    '{"where":"","column":"id,name","order_by":"name"}',
                ]
            )
        })
        .then(() => {
            return db.insert(
                'form_fields',
                [
                    'section_id',
                    'label',
                    'field_name',
                    'placeholder',
                    'field_type',
                    'required',
                    'disabled',
                    'sort_order',
                    'error_message',
                    'options_source_table',
                    'settings',
                ],
                [
                    '9',
                    'Vendor Name',
                    'user_id',
                    '',
                    'select',
                    '1',
                    '0',
                    '2',
                    'Please enter vendor name',
                    'users',
                    '{"where":"","column":"id,name","order_by":"name"}',
                ]
            )
        })
        .then(() => {
            return db.insert(
                'form_fields',
                [
                    'section_id',
                    'label',
                    'field_name',
                    'field_type',
                    'required',
                    'disabled',
                    'sort_order',
                    'error_message',
                ],
                [
                    '9',
                    'Price (Primary)',
                    'primary_rate',
                    'textbox',
                    '1',
                    '0',
                    '3',
                    'Please enter price',
                ]
            )
        })
        .then(() => {
            return db.insert(
                'form_fields',
                [
                    'section_id',
                    'label',
                    'field_name',
                    'placeholder',
                    'field_type',
                    'required',
                    'disabled',
                    'sort_order',
                    'error_message',
                ],
                [
                    '9',
                    'price (Secondary)',
                    'secondary_rate',
                    'Price',
                    'textbox',
                    '1',
                    '0',
                    '4',
                    'Please enter price',
                ]
            )
        })
        .then(() => {
            return db.insert(
                'form_fields',
                [
                    'section_id',
                    'label',
                    'field_name',
                    'placeholder',
                    'field_type',
                    'required',
                    'disabled',
                    'sort_order',
                    'error_message',
                ],
                [
                    '9',
                    'Rate Date',
                    'rate_date',
                    'Rate date',
                    'date',
                    '1',
                    '0',
                    '5',
                    'Please enter rate date',
                ]
            )
        })
}

exports.down = function (db) {
    return null
}

exports._meta = {
    version: 1,
}
