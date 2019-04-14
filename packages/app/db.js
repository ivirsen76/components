require('dotenv').config()

const mysql = require('mysql')
const { execSync } = require('child_process')
const _map = require('lodash/map')
const _pick = require('lodash/pick')
const path = require('path')
const fs = require('fs')
const expect = require('expect')
const { ExternalAssertionLibraryError } = require('testcafe/lib/errors/test-run')

const currentDir = process.cwd()
const {
    IE_DB_NAME,
    IE_DB_HOSTNAME,
    IE_DB_USERNAME,
    IE_DB_PASSWORD,
    IE_ALLOW_RESTORING_DB,
} = process.env
const dumpPath = path.join(currentDir, 'testcafe', 'db', 'dump.sql')
const tmpDumpPath = path.join(currentDir, 'storage', 'app', 'testcafeDump.sql')
const expectTime = 3000 // time to wait for assertion
const retryingPause = 200 // pause between retrying

const connectionConfig = {
    host: IE_DB_HOSTNAME,
    user: IE_DB_USERNAME,
    password: IE_DB_PASSWORD,
    database: IE_DB_NAME,
}

const dbCredentials = ` -h ${IE_DB_HOSTNAME} -u ${IE_DB_USERNAME} --password="${IE_DB_PASSWORD}" `

const checkPermissions = () => {
    if (!IE_ALLOW_RESTORING_DB) {
        throw new Error('Cannot change DB on production')
    }
}

const getStringConditions = conditions =>
    _map(conditions, (item, key) => {
        if (item === null) {
            return `${key} IS NULL`
        }

        return `${key}="${item}"`
    }).join(' AND ')

const restoreDb = () => {
    checkPermissions()

    const needNewDump = (() => {
        const getMaxModifiedTime = dir =>
            fs.readdirSync(dir).reduce((max, file) => {
                const name = path.join(dir, file)

                if (/testcafeDump\.sql$/.test(name) || /\.bundle\.filename$/.test(name)) {
                    return max
                }

                const stat = fs.statSync(name)
                const isDirectory = stat.isDirectory()

                return isDirectory
                    ? Math.max(max, getMaxModifiedTime(name))
                    : Math.max(max, stat.mtimeMs)
            }, 0)

        const appDefsModifiedTime = getMaxModifiedTime(
            path.join(__dirname, '..', '..', 'storage', 'app')
        )
        const dumpModifiedTime = fs.statSync(dumpPath).mtimeMs
        const tmpDumpModifiedTime = (() => {
            if (!fs.existsSync(tmpDumpPath)) {
                return 0
            }
            return fs.statSync(tmpDumpPath).mtimeMs
        })()

        return tmpDumpModifiedTime < appDefsModifiedTime || tmpDumpModifiedTime < dumpModifiedTime
    })()

    // Clean db
    execSync(
        `mysql ${dbCredentials} -e "DROP DATABASE ${IE_DB_NAME}; CREATE DATABASE ${IE_DB_NAME};"`,
        { stdio: 'ignore' }
    )

    if (needNewDump) {
        // Restore data
        execSync(`mysql ${dbCredentials} ${IE_DB_NAME} < ${dumpPath}`, { stdio: 'ignore' })

        // Apply appdefs changes
        console.info('Getting appDefs changes...')
        execSync('php artisan appdef:process --force')

        // Create the full dump
        execSync(`mysqldump ${dbCredentials} ${IE_DB_NAME} --skip-comments > ${tmpDumpPath}`, {
            stdio: 'ignore',
        })
    } else {
        execSync(`mysql ${dbCredentials} ${IE_DB_NAME} < ${tmpDumpPath}`, { stdio: 'ignore' })
    }
}

const generateDump = async () => {
    checkPermissions()

    const noDataTables = ['access_log', 'event_log', 'app_data']

    // Apply appdefs changes
    console.info('Getting appDefs changes...')
    execSync('php artisan appdef:process --force')

    let dump = execSync(
        `mysqldump ${dbCredentials} ${IE_DB_NAME} --skip-comments --extended-insert=false`
    ).toString()

    // Add empty lines
    dump = dump.replace(/(DROP TABLE IF EXISTS)/gi, '\n\n\n$1')

    // Remove auto increment
    dump = dump.replace(/ AUTO_INCREMENT=[0-9]+ /gi, ' ')

    // Remove data for some tables
    noDataTables.forEach(table => {
        const regex = new RegExp(
            `LOCK TABLES \`${table}[\\s\\S]*${table}\` ENABLE KEYS[^U]*UNLOCK TABLES;`,
            'gi'
        )
        dump = dump.replace(regex, '')
    })

    fs.writeFileSync(dumpPath, dump)
}

const getNumRecords = (table, conditions) => {
    checkPermissions()

    const where = conditions ? 'WHERE ' + getStringConditions(conditions) : ''
    const query = `SELECT count(*) AS cnt FROM ${table} ${where}`

    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionConfig)
        connection.connect()
        connection.query(query, (error, results, fields) => {
            if (error) {
                reject(new Error(error.message))
            } else {
                resolve(results[0].cnt)
            }
        })
        connection.end()
    })
}

const runQuery = query => {
    checkPermissions()

    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionConfig)
        connection.connect()
        connection.query(query, (error, results, fields) => {
            resolve(results)
        })
        connection.end()
    })
}

const getRecord = (table, conditions) => {
    checkPermissions()

    const where = conditions ? 'WHERE ' + getStringConditions(conditions) : ''
    const query = `SELECT * FROM ${table} ${where} LIMIT 0, 1`

    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionConfig)
        connection.connect()
        connection.query(query, (error, results, fields) => {
            resolve(results[0])
        })
        connection.end()
    })
}

const expectRecordToExist = async (table, conditions, data) => {
    checkPermissions()

    const before = Date.now()

    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            const record = await getRecord(table, conditions)
            if (!record) {
                throw new ExternalAssertionLibraryError(
                    `The record in table "${table}" is not found`
                )
            }

            if (data) {
                try {
                    expect(_pick(record, Object.keys(data))).toEqual(data)
                } catch (error) {
                    throw new ExternalAssertionLibraryError(
                        `The record in table "${table}" has different data\n\n` + error.message
                    )
                }
            }

            return record
        } catch (error) {
            if (Date.now() - before > expectTime) {
                throw error
            }

            // wait a bit
            await new Promise(resolve => setTimeout(resolve, retryingPause))
        }
    }
}

module.exports = {
    restoreDb,
    generateDump,
    getNumRecords,
    runQuery,
    getRecord,
    expectRecordToExist,
}
