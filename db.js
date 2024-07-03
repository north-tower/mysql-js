const mysql = require('mysql2/promise');

async function connectToDatabase() {
    const config = {
        host: 'sql304.infinityfree.com',
        user: 'if0_36571718',
        password: 'bUFaPYdGJO',
        database: 'if0_36571718_faas',
        port: 3306
    };

    try {
        const connection = await mysql.createConnection(config);
        console.log('Connected to MySQL Server');
        return connection;
    } catch (err) {
        console.error('Database Connection Failed! Bad Config:', err.message);
        throw err;
    }
}

module.exports = connectToDatabase;
