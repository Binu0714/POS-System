import {order_db, customer_db, item_db} from '../db/db.js';
import OrderModel from '../model/OrderModel.js';

$(document).ready(function (){
    clearFeilds();
});

function nextId() {
    let id;

    if (order_db.length>0){
        const lastId = order_db[order_db.length-1].id;
        id = parseInt(lastId.slice(1))+1;
        id = 'O'+id.toString().padStart(3,'0');
    }else {
        id = 'O001';
    }
    return id;
}

function clearFeilds() {
    $('#order_id').val(nextId());
   //complete karanna ona
}

export function setCustomerIds(){
    const customerIds = customer_db.map(customer => customer.id);
    const dropdown = document.getElementById("dropdownList");
    const input = document.getElementById("inputCustomerId");

    dropdown.innerHTML = "";

    customerIds.forEach(id => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.className = "dropdown-item";
        a.textContent = id;

        a.addEventListener("click", function (e) {
            e.preventDefault();
            input.value = this.textContent;

            const customer = getCustomerByUd(this.textContent);
            $('#inputCustomerName').val(customer.name);        });

        li.appendChild(a);
        dropdown.appendChild(li);
    });}

function getCustomerByUd(id) {
    return customer_db.find(item => item.id === id);
}


