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

const FollowupType = {
    Call: 'Call',
    Email: 'Email',
    Visit: 'Visit',
    Message: 'Message',
    Other: 'Other',
}

const globalVariables = {
    LeadStatus: LeadStatus,
    VendorType: VendorType,
    UserTypes: UserTypes,
    FollowupType: FollowupType,
}
const removeWhiteSpace = R.replace(/\s+/g, '')

const isObjectNotEmptyOrUndefined = R.allPass([
    R.complement(R.isNil),
    R.ifElse(
        R.anyPass([R.is(Object), R.is(Array)]),
        R.complement(R.isEmpty),
        R.T
    ),
])

const isNotNilOrEmpty = R.allPass([
    R.complement(R.isNil), // Check if not null or undefined
    R.complement(R.isEmpty), // Check if not an empty string
    R.compose(R.complement(R.isEmpty)), // Check if not empty after trimming
])

const removeBlankSpaces = R.reject(R.equals(''))
const isNotEmpty = R.compose(R.not, R.either(R.isEmpty, R.isNil))

const createRemoveFunction = (substring1) => R.replace(substring1, '')

const getStartAndEnd = R.compose(
    R.join(''),
    R.juxt([
        R.take(10), // Get the first 5 characters
        R.takeLast(5), // Get the last 5 characters
    ])
)

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
    getStartAndEnd,
}
