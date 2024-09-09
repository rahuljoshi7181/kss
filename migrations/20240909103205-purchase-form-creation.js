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
        .addColumn('forms', 'tabing', {
            type: 'tinyint',
            notNull: true,
            defaultValue: 0,
        })
        .then(() => {
            return db.addColumn('form_sections', 'recursion', {
                type: 'tinyint',
                notNull: true,
                defaultValue: 0,
            })
        })
        .then(() => {
            return db.insert(
                'forms',
                ['id', 'form_title', 'tabing'],
                ['7', 'purchase', '1']
            )
        })
        .then(() => {
            return db.insert(
                'form_sections',
                ['id', 'form_id', 'section_title', 'sort_order'],
                ['7', '7', 'Purchase', '1']
            )
        })
        .then(() => {
            return db.insert(
                'form_sections',
                ['id', 'form_id', 'section_title', 'sort_order', 'recursion'],
                ['8', '7', 'Expenses', '2', '1']
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
                    '7',
                    'Fruit',
                    'fruit_category_id',
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
                    'field_type',
                    'required',
                    'disabled',
                    'sort_order',
                    'error_message',
                ],
                [
                    '7',
                    'Price',
                    'price',
                    'textbox',
                    '1',
                    '0',
                    '2',
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
                    'options_source_table',
                    'settings',
                ],
                [
                    '7',
                    'User Name',
                    'user_id',
                    '',
                    'select',
                    '1',
                    '0',
                    '3',
                    'Please enter user name',
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
                    'placeholder',
                    'field_type',
                    'required',
                    'disabled',
                    'sort_order',
                    'error_message',
                ],
                [
                    '7',
                    'Order Date',
                    'order_date',
                    'Order date',
                    'date',
                    '1',
                    '0',
                    '5',
                    'Please enter next Order date',
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
                    '7',
                    'Deliver Date',
                    'deliver_date',
                    'Deliver date',
                    'date',
                    '1',
                    '0',
                    '6',
                    'Please enter Deliver date',
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
                    '7',
                    'Primary Quantity',
                    'primary_quantity',
                    'primary_quantity',
                    'textbox',
                    '0',
                    '0',
                    '6',
                    '',
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
                    '7',
                    'Secondary Quantity',
                    'secondary_quantity',
                    'Secondary Quantity',
                    'textbox',
                    '0',
                    '0',
                    '7',
                    'Please enter Secondary Quantity',
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
                    'Transportation',
                    'transport_id',
                    '',
                    'select',
                    '1',
                    '0',
                    '8',
                    'Please enter Transporter',
                    'transport',
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
                ],
                [
                    '7',
                    'Address',
                    'address',
                    'Address',
                    'textarea',
                    '0',
                    '0',
                    '10',
                    'Please enter Address',
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
                    '7',
                    'Notes',
                    'notes',
                    '',
                    'textarea',
                    '0',
                    '0',
                    '11',
                    'Please enter notes',
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
                    '7',
                    'Bill No',
                    'bill_number',
                    '',
                    'textbox',
                    '0',
                    '0',
                    '12',
                    '',
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
                ['7', 'Bill (file)', 'bill', '', 'file', '0', '0', '13', '']
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
                    '8',
                    'Expense',
                    'expense_id',
                    '',
                    'select',
                    '1',
                    '0',
                    '1',
                    'Please enter expenses',
                    'expenses',
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
                ],
                [
                    '8',
                    'Amount',
                    'amount',
                    'Please enter amount',
                    'textbox',
                    '1',
                    '0',
                    '2',
                    'Please enter Amount',
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
                    '8',
                    'Description',
                    'description',
                    'Description',
                    'textbox',
                    '0',
                    '0',
                    '3',
                    '',
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
