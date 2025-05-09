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