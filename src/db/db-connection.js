const dotenv = require('dotenv');
dotenv.config();
const mysql2 = require('mysql2');

class DBConnectionn{
    constructor(){
        this.db = mysql2.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE
        });
        this.checkConnection();
    }

    checkConnection(){
        this.db.getConnection((err, connection) => {
            if (err){
                console.log(err)
            }
            if (connection){
                connection.release();
            }
            return
        });
    }
    query = async (sql, value) => {
        return new Promise((resolve, reject)=>{
            const callback = (error, result) => {
                if(error){
                    reject(error);
                    return;
                }
                resolve(result)
            }
            this.db.execute(sql, value, callback)
        }).catch(err => {
            const mysqlErrorList = Object.keys(HttpStatusCodes);
            err.status = mysqlErrorList.includes(err.code) ? HttpStatusCodes[err.code] : err.status;

            throw err;
        })
    }
}
const HttpStatusCodes = Object.freeze({
    ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: 422,
    ER_DUP_ENTRY: 409
});

module.exports = new DBConnectionn().query;