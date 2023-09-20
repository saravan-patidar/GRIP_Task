const sql = require('mysql');

const con = sql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: "banking_system"
});
con.connect((err) => {
    if (err) {
        console.warn("error is connection");
    }
    // else {
    //     console.warn("connected");
    // }
})

// con.query('select * from users', (err, result) => {
//     console.log(result);
// })

module.exports = con;