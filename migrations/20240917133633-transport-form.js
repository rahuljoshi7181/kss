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
        .addColumn('transport', 'created_by', {
            type: 'int',
            notNull: false,
            defaultValue: null,
        })
        .then(() => {
            return db.addColumn('transport', 'updated_by', {
                type: 'int',
                notNull: false,
                defaultValue: null,
            })
        })
        .then(() => {
            return db.insert(
                'forms',
                ['id', 'form_title', 'tabing'],
                ['9', 'transport', '0']
            )
        })
        .then(() => {
            return db.insert(
                'form_sections',
                ['id', 'form_id', 'section_title', 'sort_order'],
                ['10', '9', 'transport', '1']
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
                ],
                [
                    '10',
                    'Company Name',
                    'transporter_company_name',
                    'Company Name',
                    'textbox',
                    '1',
                    '0',
                    '1',
                    'Please enter company name',
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
                    '10',
                    'Route',
                    'route',
                    'Kota-Banglore',
                    'textbox',
                    '1',
                    '0',
                    '2',
                    'Please enter route',
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
                    '10',
                    'Route start',
                    'route_start',
                    'Route start',
                    'textbox',
                    '1',
                    '0',
                    '3',
                    'Please enter next Route start point',
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
                    '10',
                    'Route End',
                    'route_end',
                    'Route End',
                    'textbox',
                    '1',
                    '0',
                    '4',
                    'Please enter next Route end point',
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
                    '10',
                    'Address',
                    'office_address',
                    'office_address',
                    'textarea',
                    '1',
                    '0',
                    '5',
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
                    '10',
                    'Contact number',
                    'contact_number',
                    'Contact number',
                    'textbox',
                    '1',
                    '0',
                    '6',
                    'Please enter contact number',
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
                    '10',
                    'Notes',
                    'notes',
                    '',
                    'textarea',
                    '1',
                    '0',
                    '7',
                    'Please enter notes',
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
