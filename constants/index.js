const R = require('ramda')
const HEADER_ICM_CO = 'KSS-ID'
const UserTypes = {
    VENDOR: 1,
    SELLER: 2,
    INTERNAL: 3,
    LEAD: 4,
}

const isObjectNotEmptyOrUndefined = R.allPass([
    R.complement(R.isNil), // Check if not null or undefined
    R.complement(R.isEmpty), // Check if not empty
])

module.exports = {
    HEADER_ICM_CO,
    UserTypes,
    isObjectNotEmptyOrUndefined,
}
