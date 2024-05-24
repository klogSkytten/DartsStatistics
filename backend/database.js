//REQUIREMENTS
const mysql = require('mysql2');

//////////////////////////////////////////////////////////////////////
// DATABASE POOL
//////////////////////////////////////////////////////////////////////
const connection = mysql.createConnection({
    host: 'db',
    port: '3306',
    user: 'root',
    password: 'tRyP6po*fc2sA$'
});

// CONSTANT AND FUNCTION EXPORT
module.exports = {connection} //, read, write}