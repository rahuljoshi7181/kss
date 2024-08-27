const messages = require('../messages/messages')
const logger = require('../logger')
const { getRecords } = require('../models/db-common')
const { getDataFromTable } = require('../helper')
const [table, form_field, form_sections] = [
    'forms',
    'form_fields',
    'form_sections',
]
const getForms = async (req, h) => {
    let connection
    try {
        connection = await req.server.mysqlPool.getConnection()

        // let signedUrl =
        //     await req.server.plugins.s3Plugin.getSignedUrl('first.png')

        const formName = req.query.form_name || ''
        const joins = [
            {
                type: 'INNER',
                table: form_sections,
                on: `${form_sections}.form_id=${table}.id`,
            },
            {
                type: 'INNER',
                table: form_field,
                on: `${form_field}.section_id=${form_sections}.id`,
            },
        ]

        let columns = [
            { name: `${table}.id`, alias: 'form_id' },
            { name: `${table}.form_title`, alias: 'form_title' },
            { name: `${form_sections}.id`, alias: 'section_id' },
            { name: `${form_sections}.section_title`, alias: 'section_title' },
            { name: `${form_field}.label`, alias: 'field_label' },
            { name: `${form_field}.field_name`, alias: 'field' },
            { name: `${form_field}.field_type`, alias: 'type' },
            { name: `${form_field}.placeholder`, alias: 'field_placeholder' },
            { name: `${form_field}.required`, alias: 'required' },
            { name: `${form_field}.options`, alias: 'options' },
            { name: `${form_field}.dependent_field`, alias: 'dependent_field' },
            { name: `${form_field}.field_value`, alias: 'field_value' },
            {
                name: `${form_field}.options_source_table`,
                alias: 'options_source_table',
            },
            { name: `${form_field}.options_query`, alias: 'options_query' },
        ]

        // Define the where condition
        const whereCondition = `${table}.form_title='${formName}'`
        const rows = await getRecords({
            table,
            columns,
            order_by: 'asc',
            order_by_column: `${form_sections}.sort_order,${form_field}.sort_order`,
            limit: 0,
            offset: 0,
            connection,
            joins,
            pagination: false,
            where: whereCondition,
        })

        const transformedData = {
            form_id: rows[0].form_id,
            form_title: rows[0].form_title,
            sections: [],
        }

        const sectionsMap = {}

        for (const field of rows) {
            let optionsVal = {}
            if (!sectionsMap[field.section_id]) {
                sectionsMap[field.section_id] = {
                    section_id: field.section_id,
                    section_title: field.section_title,
                    sort_order: field.section_id, // Assuming sort_order is based on section_id
                    fields: [],
                }
                transformedData.sections.push(sectionsMap[field.section_id])
            }

            if (field.type === 'select' && field.options_source_table != null) {
                optionsVal = await getDataFromTable(
                    field.options_source_table,
                    connection
                )
            }

            sectionsMap[field.section_id].fields.push({
                field_id: field.section_id, // Assuming field_id is section_id for uniqueness in this example
                label: field.field_label,
                field_name: field.field,
                field_type: field.type,
                placeholder: field.field_placeholder,
                dependent_field: field.dependent_field,
                required: field.required === 1,
                disabled: false, // Assuming no disabled field in provided data
                options: optionsVal === '' ? field.options : optionsVal,
                sort_order: sectionsMap[field.section_id].fields.length + 1,
            })
        }
        return h
            .response(
                messages.successResponse(
                    transformedData,
                    'Form fetched successfully!'
                )
            )
            .code(200)
    } catch (error) {
        logger.error(error)
        throw messages.createBadRequestError(
            error.message || 'An error occurred while fetching the form.'
        )
    } finally {
        if (connection) await connection.release()
    }
}

module.exports = {
    getForms,
}
