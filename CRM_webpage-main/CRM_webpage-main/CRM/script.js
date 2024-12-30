document.addEventListener('DOMContentLoaded', function() {
   
    const form = document.getElementById('customerForm');
    const formTitle = document.getElementById('formTitle');
    const editIndexInput = document.getElementById('editIndex');
    const customerTableBody = document.getElementById('customerTableBody');
    let editIndex = null;

    if (form) {
                const savedCustomer = localStorage.getItem('editIndex');
        if (savedCustomer !== null) {
            const { name, email, number, dateAdded } = JSON.parse(savedCustomer);
            document.getElementById('name').value = name;
            document.getElementById('email').value = email;
            document.getElementById('number').value = number;
            document.getElementById('dateAdded').value = dateAdded;
            formTitle.textContent = 'Edit Customer';
            editIndexInput.value = localStorage.getItem('editIndexValue');
            editIndex = editIndexInput.value;
        }

        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const number = document.getElementById('number').value.trim();
            const dateAdded = document.getElementById('dateAdded').value;
            let customers = JSON.parse(localStorage.getItem('customers')) || [];

            if (name && email && number && dateAdded) {
                if (editIndex !== null && editIndex !== "") {
                    // Update existing customer
                    customers[editIndex] = { name, email, number, dateAdded };
                    localStorage.setItem('customers', JSON.stringify(customers));
                    formTitle.textContent = 'Add New Customer';
                    localStorage.removeItem('editIndex');
                    editIndex = null;
                    editIndexInput.value = '';
                } else {
                    // Add new customer
                    customers.push({ name, email, number, dateAdded });
                    localStorage.setItem('customers', JSON.stringify(customers));
                }
                form.reset();
                window.location.href = 'table.html';
            } else {
                alert('Please fill in all fields.');
            }
        });

        document.getElementById('resetForm')?.addEventListener('click', function() {
            form.reset();
        });
    }

    if (customerTableBody) {
        function updateTable() {
            customerTableBody.innerHTML = '';
            const customers = JSON.parse(localStorage.getItem('customers')) || [];
            customers.forEach((customer, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${customer.name}</td>
                    <td>${customer.email}</td>
                    <td>${customer.number}</td>
                    <td>${customer.dateAdded}</td>
                    <td>
                        <button class="btn-edit" data-index="${index}">Edit</button>
                        <button class="btn-delete" data-index="${index}">Delete</button>
                    </td>
                `;
                customerTableBody.appendChild(row);
            });
        }

        updateTable();

        customerTableBody.addEventListener('click', function(event) {
            const index = event.target.getAttribute('data-index');
            if (event.target.classList.contains('btn-edit')) {
                const customers = JSON.parse(localStorage.getItem('customers')) || [];
                const customer = customers[index];
                localStorage.setItem('editIndex', JSON.stringify(customer));
                localStorage.setItem('editIndexValue', index);
                window.location.href = 'form.html';
            } else if (event.target.classList.contains('btn-delete')) {
                let customers = JSON.parse(localStorage.getItem('customers')) || [];
                customers.splice(index, 1);
                localStorage.setItem('customers', JSON.stringify(customers));
                updateTable();
            }
        });
    }  
});
