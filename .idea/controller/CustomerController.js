import {customer_db} from "../db/db.js";
import CustomerModel from "../model/CustomerModel.js";
import {setCustomerIds} from "../controller/OrderController.js";

let id;
let rowIndex;

$(document).ready(function (){
    clearFeilds();
    setCustomerIds();
});

function loadCustomers() {
    $('#customer-tbody').empty();
    customer_db.map((item,index)=>{
        let id = item.id;
        let name = item.name;
        let address = item.address;
        let nic = item.nic;
        let phone = item.phone;

        let data = `<tr class="table-row">
                <td>${id}</td>
                <td>${name}</td>
                <td>${address}</td>
                <td>${nic}</td>
                <td>${phone}</td>
        </tr>`
        $('#customer-tbody').append(data);
    })
}

function nextId() {
    let id;

    if (customer_db.length>0){
        const lastId = customer_db[customer_db.length-1].id;
        id = parseInt(lastId.slice(1))+1;
        id = 'C'+id.toString().padStart(3,'0');
    }else {
        id = 'C001';
    }
    return id;
}

$('#c_save').on('click',function (){
    let id = nextId();
    var name = $('#name').val();
    var address = $('#address').val();
    var nic = $('#nic').val();
    var phone = $('#phone').val();

    const namePattern = /^[A-Za-z\s]+$/;
    const addressPattern = /^[A-Za-z0-9\s,.'-]{3,}$/;
    const nicPattern = /^(\d{9}[Vv]|\d{12})$/;
    const phonePattern = /^0\d{9}$/;

    if (name=='' || address=='' || nic=='' || phone==''){
        Swal.fire({
            icon: 'error',
            title: 'Missing Information',
            text: 'Please complete all required fields before proceeding.',
        });
        return;
    }

    if (!namePattern.test(name)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Input',
            text: 'Please check your input values and try again.',
        });
        return;
    }

    if (!addressPattern.test(address)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Input',
            text: 'Please check your input values and try again.',
        });
        return;
    }

    if (!nicPattern.test(nic)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Input',
            text: 'Please check your input values and try again.Use 123456789V or 200012345678 format.',
        });
        return;
    }

    if (!phonePattern.test(phone)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Input',
            text: 'Please check your input values and try again.Use 10 digits starting with 0.',
        });
        return;
    }

        let customer_data = new CustomerModel(id,name,address,nic,phone);
        customer_db.push(customer_data);

        console.log(customer_data);
        console.log(customer_db);

    Swal.fire({
        icon: 'success',
        title: 'Customer Added',
        text: 'Customer added successfully!',
        confirmButtonText: 'OK'
    });

        loadCustomers();
        clearFeilds();
        setCustomerIds();

});

$('#c_reset').on('click',function () {
    clearFeilds();
});

$('#customer-tbody').on('click','tr',function () {
    let idx = $(this).index();
    let obj = customer_db[idx];
    console.log(obj);

    id = obj.id;
    let name = obj.name;
    let address = obj.address;
    let nic = obj.nic;
    let phone = obj.phone;

    console.log(id,name,address,nic,phone);

    $('#id').val(id);
    $('#name').val(name);
    $('#address').val(address);
    $('#nic').val(nic);
    $('#phone').val(phone);
});

$('#c_delete').on('click',function () {
    let name = $('#name').val();
    let address = $('#address').val();
    let nic = $('#nic').val();
    let phone = $('#phone').val();

    if (id=='' || name=='' || address=='' || nic=='' || phone==''){
        Swal.fire({
            icon: 'error',
            title: 'Missing Information',
            text: 'Please select a customer to delete',
        });
        return;
    }else {
        customer_db.splice(rowIndex,1);

        Swal.fire({
            icon: 'success',
            title: 'Customer Deleted',
            text: 'Customerdeleted successfully!',
            confirmButtonText: 'OK'
        });


        loadCustomers();
        nextId();
        clearFeilds();
        setCustomerIds();
    }
});

function clearFeilds() {
    $('#id').val(nextId());
    $('#name').val('');
    $('#address').val('');
    $('#nic').val('');
    $('#phone').val('');
    $('#SearchBar').val('');
}

$('#c_update').on('click',function () {
    let name = $('#name').val();
    let address = $('#address').val();
    let nic = $('#nic').val();
    let phone = $('#phone').val();

    if (name=='' || address=='' || nic=='' || phone==''){
        $('#c_update').prop().disabled = true;
    }else{
        let customer_data = new CustomerModel(id,name,address,nic,phone);
        customer_db.splice(customer_db.findIndex(item => item.id==id),1,customer_data);

        Swal.fire({
            icon: 'success',
            title: 'Customer Updated',
            text: 'Customer updated successfully!',
            confirmButtonText: 'OK'
        });

        loadCustomers();
        nextId();
        clearFeilds();
        setCustomerIds();
    }
});

$('#customer-search').on('click',function () {
    let searchCustomer = $('#SearchBar').val().trim();

    if (searchCustomer){
        let found = false;

        customer_db.forEach(customer => {
            if (customer.name==searchCustomer ||customer.nic==searchCustomer || customer.phone==searchCustomer){
                $('#id').val(customer.id);
                $('#name').val(customer.name);
                $('#address').val(customer.address);
                $('#nic').val(customer.nic);
                $('#phone').val(customer.phone);

                found = true;
                return;
            }
        });

        if (!found) {
            Swal.fire({
                icon: 'error',
                title: 'Not Found',
                text: 'Customer not found.Try search with Customer Name , NIC or Phone Number.'
            });
        }
    }
});