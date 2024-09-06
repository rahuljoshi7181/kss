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
        .insert('forms', ['id', 'form_title'], ['6', 'follow_up'])
        .then(() => {
            return db.insert(
                'form_sections',
                ['id', 'form_id', 'section_title', 'sort_order'],
                ['6', '6', 'Follow up', '1 ']
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
                    '6',
                    'Follow up Date',
                    'follow_up_date',
                    'Date',
                    'date',
                    '1',
                    '0',
                    '1',
                    'Please enter follow up',
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
                    'options_source_table',
                    'error_message',
                ],
                [
                    '6',
                    'type',
                    'follow_up_type',
                    'select',
                    '1',
                    '0',
                    '2',
                    'INTERNAL_FollowupType',
                    'Please enter follow type',
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
                    '6',
                    'notes',
                    'follow_up_notes',
                    'notes',
                    'textarea',
                    '0',
                    '0',
                    '3',
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
                    '6',
                    'next date',
                    'next_follow_up_date',
                    'Date',
                    'date',
                    '1',
                    '0',
                    '4',
                    'Please enter next follow up date',
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
