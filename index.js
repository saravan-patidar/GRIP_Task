const express = require('express');
const con = require('./config');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// app.get('/',(req,res)=>{
//     // res.send('Alll done !!!');
//     con.query('select * from users',(err,result)=>{
//         // res.send(result);


//         // res.send(result.map((row) => `
//         //         <tr>
//         //           <td>${row.id}</td>
//         //           <td>${row.Name}</td>
//         //           <td>${row.email}</td>
//         //           <td>${row.amount}</td>
//         //         </tr>
//         //       `).join('<br>'));

//     });
// });c
app.use(express.static('public'))
app.get('/index', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})
// View Customers page
app.get('/customer_list', (req, res) => {
    // Perform a database query to retrieve transaction data
    con.query('select * from customers', (err, results) => {

        if (err) {
            console.error("Error fetching transaction data: " + err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        // Render the view_transactions.html template with the data
        // res.render('view_transactions', { transactions: results});

        // Send the results as JSON
        res.json(results);
    });
});

// Define a route to retrieve a list of all transactions
app.get('/transactions', (req, res) => {
    // Define the SQL query to fetch all transactions
    const sql = 'SELECT * FROM transfers';

    // Execute the query
    con.query(sql, (err, results) => {
        if (err) {
            console.error('Error retrieving transactions:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        // If successful, send the transaction data as JSON
        res.json(results);
    });
});



// Define a route for handling money transfers
app.post('/transfer', (req, res) => {
    const { senderId, receiverId, amount } = req.body;

    // Ensure that senderId and receiverId are valid integers and amount is a positive number
    if (!Number.isInteger(senderId) || !Number.isInteger(receiverId) || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Invalid input data.' });
    }
    if (senderId === receiverId) {
        return res.json({ error: 'Same person not Transfer' })
    }

    // Check if both senderId and receiverId exist in the database
    con.query('SELECT * FROM Customers WHERE id IN (?, ?)', [senderId, receiverId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error.' });
        }

        if (results.length !== 2) {
            return res.status(404).json({ error: 'Sender or receiver not found.' });
        }

        const sender = results.find((customer) => customer.id === senderId);
        const receiver = results.find((customer) => customer.id === receiverId);

        const senderName = sender.name;
        const receiverName = receiver.name;

        // console.log(sender, senderName)
        // Check if the sender has enough balance for the transfer
        if (sender.balance < amount) {
            return res.status(400).json({ error: 'Insufficient balance.' });
        }

        // Update sender and receiver balances and record the transaction
        const newSenderBalance = sender.balance - amount;
        const newReceiverBalance = receiver.balance + amount;

        con.query(
            'UPDATE Customers SET balance = ? WHERE id = ?',
            [newSenderBalance, senderId],
            (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error.' });
                }

                con.query(
                    'UPDATE Customers SET balance = ? WHERE id = ?',
                    [newReceiverBalance, receiverId],
                    (err) => {
                        if (err) {
                            return res.status(500).json({ error: 'Database error.' });
                        }

                        // Record the transaction in the Transfers table
                        const timestamp = new Date().toISOString();
                        con.query(
                            'INSERT INTO Transfers (sender_id, receiver_id, sender_name, receiver_name, amount, timestamp) VALUES (?, ?, ?, ?, ?, ?)',
                            [senderId, receiverId, senderName, receiverName, amount, timestamp],
                            (err) => {
                                if (err) {
                                    return res.status(500).json({ error: 'Database error.' });
                                }

                                return res.status(200).json({ success: 'Transfer successful.' });
                            }
                        );
                    }
                );
            }
        );
    });
});



app.listen(5500);