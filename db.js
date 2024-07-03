const sql = require('mssql');

const config = {
    user: 'if0_36571718',
    password: 'bUFaPYdGJO',
    server: 'sql304.infinityfree.com',
    database: 'if0_36571718_faas',
    port: 3306,
    options: {
        encrypt: true, // Use this if you're on Azure
        enableArithAbort: true
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => console.log('Database Connection Failed! Bad Config: ', err));

module.exports = {
    sql, poolPromise
};
