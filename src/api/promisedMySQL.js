const mysql = require('mysql');
const settings = require('../../settings.json');

module.exports = (query) => {
	const connection = mysql.createConnection({
        host: settings.mysql.host,
        user: settings.mysql.username,
        password: settings.mysql.password,
        database: settings.mysql.database,
        port: settings.mysql.port
    });

    connection.on('error', (_ignored) => {});
    setTimeout(() => {
        connection.end((_ignored) => {});
    }, 10_000);

    return new Promise((resolve, reject) => {
        connection.query(query, (error, result) => {
            if(error) return reject(error);

            resolve(result);
        })
    });
}