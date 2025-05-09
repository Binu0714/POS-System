import {customer_db} from "../db/db.js";
import CustomerModel from "../model/CustomerModel.js";

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

    let customer_data = new CustomerModel(id,name,address,nic,phone);
    customer_db.push(customer_data);

    loadCustomers();

    console.log(customer_data);
    console.log(customer_db);
})