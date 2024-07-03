/**
    Accessible routes for public
    those routes do not need authentication
    * @type {string[]}
*/

export const publicRoutes = [
    "/"
]

/**
    *Accessible routes related with login things
    *those routes need authentication
    those will be redirect settings
    * @type {string[]}
*/
export const authRoutes = [
    "/auth/login",
    "/auth/register"
]



/**
    * prefix for api authentication * rotues
    * @type {string}
*/
export const apiAuthPrefix = "/api/auth"

/**
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings"