const R = require('ramda')
const HEADER_ICM_CO = 'KSS-ID'

const UserTypes = {
    1: 'Vendor',
    2: 'Seller',
    3: 'Internal',
    4: 'Lead',
}

const VendorType = {
    1: 'Street Seller',
    2: 'Local Vendor',
    3: 'Other',
}

const LeadStatus = {
    1: 'New',
    2: 'Contacted',
    3: 'Interested',
    4: 'Not Interested',
    5: 'Converted',
}

const globalVariables = {
    LeadStatus: LeadStatus,
    VendorType: VendorType,
    UserTypes: UserTypes,
}
const removeWhiteSpace = R.replace(/\s+/g, '')

const isObjectNotEmptyOrUndefined = R.allPass([
    R.complement(R.isNil), // Check if not null or undefined
    R.complement(R.isEmpty), // Check if not empty
])

const isNotNilOrEmpty = R.allPass([
    R.complement(R.isNil), // Check if not null or undefined
    R.complement(R.isEmpty), // Check if not an empty string
    R.compose(R.complement(R.isEmpty)), // Check if not empty after trimming
])

const removeBlankSpaces = R.reject(R.equals(''))
const isNotEmpty = R.compose(R.not, R.either(R.isEmpty, R.isNil))

const createRemoveFunction = (substring1) => R.replace(substring1, '')

module.exports = {
    HEADER_ICM_CO,
    UserTypes,
    VendorType,
    isObjectNotEmptyOrUndefined,
    isNotNilOrEmpty,
    LeadStatus,
    isNotEmpty,
    removeWhiteSpace,
    removeBlankSpaces,
    createRemoveFunction,
    globalVariables,
}
