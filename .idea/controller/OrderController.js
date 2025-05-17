import {order_db, customer_db, item_db} from '../db/db.js';
import OrderModel from '../model/OrderModel.js';

$(document).ready(function (){
    clearFeilds();
    setItemIds();
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
    const dropdown = document.getElementById("customerDropdownList");
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
            $('#inputCustomerName').val(customer.name);
        });

        li.appendChild(a);
        dropdown.appendChild(li);
    });
}

export function setItemIds(){
    const itemIds = item_db.map(item => item.id);
    const dropdown = document.getElementById("itemDropdownList");
    const input = document.getElementById("inputItemId");

    dropdown.innerHTML = "";

    itemIds.forEach(id => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.className = "dropdown-item";
        a.textContent = id;

        a.addEventListener("click", function (e){
            e.preventDefault();
            input.value = this.textContent;

            $('#itemName').val(getItemByUd(this.textContent).name);
            $('#itemQty').val(getItemByUd(this.textContent).qty);
            $('#itemPrice').val(getItemByUd(this.textContent).price);
        });

        li.appendChild(a);
        dropdown.appendChild(li);
    });
}

function getItemByUd(id) {
    return item_db.find(item => item.id === id);
}

function getCustomerByUd(id) {
    return customer_db.find(item => item.id === id);
}


