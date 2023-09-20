
document.addEventListener("DOMContentLoaded", function () {
    // Get references to HTML elements
console.log('heyy its done');


    const transferForm = document.getElementById("button");

    console.log(transferForm);

    // Add a submit event listener to the transferForm
    transferForm.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent the default form submission

        // Get form inputs

      // Extract data from the form
      const senderId = parseInt(document.getElementById('senderList').value);
      const receiverId = parseInt(document.getElementById('receiverList').value);
      const amount = parseFloat(document.getElementById('amount').value);
console.log(senderId+"  "+receiverId);
      // Validate the data
      if (!Number.isInteger(senderId) || !Number.isInteger(receiverId) || isNaN(amount) || amount <= 0) {
        alert('Please enter valid data.');
        return;
      }

      // Create a data object to send in the request body
      const data = {
        senderId,
        receiverId,
        amount,
      };

      // Send a POST request to the server
      fetch('/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Convert data object to JSON
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.success) {
            alert('Transfer successful.');
            // Optionally, update the user interface or redirect to another page
          } else {
            alert('Transfer failed. ' + result.error);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('An error occurred. Please try again later.');
        });
    });
});

document.addEventListener('DOMContentLoaded',function(){
  const customerTable =document.getElementById('customer-list');
  console.log(customerTable);

  fetch('/customer_list').then((response)=> response.json())
  .then((data) =>{

     customerTable.innerHTML = "";

      //  // Create table rows for each transaction
      data.forEach((customer) => {
        const row = `
          <tr>
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.balance}</td>
          </tr>
        `;
        customerTable.innerHTML += row;
      });

  })
})

document.addEventListener("DOMContentLoaded", function () {
  const transactionTable = document.getElementById("transactionTable");
  // const customerTable = document.getElementById("customers-list");
  const senderList = document.getElementById('senderList');
  const receiverList = document.getElementById('receiverList');

  
  console.log(transactionTable);

  // Fetch transaction data from the server
  fetch("/customer_list") // Replace with the actual route on your server
    .then((response) => response.json())
    .then((data) => {

      console.log(data);
      data.forEach((customer) => {
        const senderOption = document.createElement('option');
        senderOption.value = customer.id; // Set the value to the customer's ID
        senderOption.textContent = customer.name; // Display the customer's name

        const receiverOption = document.createElement('option');
        receiverOption.value = customer.id; // Set the value to the customer's ID
        receiverOption.textContent = customer.name; // Display the customer's name

        senderList.appendChild(senderOption);
        receiverList.appendChild(receiverOption);
      });
    })
    .catch((error) => {
      console.error("Error fetching transaction data: " + error);
    });


  // Transcation Table 
  fetch('/transactions').then((response) => response.json())
    .then((data) => {
      console.log(data);
      
        data.forEach((transaction) => {
          const row = `
          <tr>
            <td>${transaction.aid}</td>
            <td>${transaction.sender_name}</td>
            <td>${transaction.receiver_name}</td>
            <td>${transaction.amount}</td>
            <td>${transaction.timestamp}</td>
          </tr>
        `;
          transactionTable.innerHTML += row;
      });
    })
    .catch((error) => {
      console.error("Error fetching transaction data: " + error);
    });;
});
