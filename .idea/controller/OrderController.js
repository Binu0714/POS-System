import {order_db, customer_db, item_db, order_detail_db} from '../db/db.js';
import OrderModel from '../model/OrderModel.js';
import OrderDetailsModel from '../model/OrderDetailsModel.js';

$(document).ready(function (){
    clearFeilds();
    setItemIds();
    setTotal();
});

function setDate() {
    const today = new Date().toISOString().split('T')[0];
    $('#date').val(today);
}

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
    setDate();
    $('#order_id').val(nextId());
    $('#inputCustomerId').val('');
    $('#inputCustomerName').val('');
    $('#inputItemId').val('');
    $('#itemName').val('');
    $('#itemQty').val('');
    $('#itemPrice').val('');
    $('#buyingQty').val('');

    $('#total-price').text('');
    $('#subtotal').text('');
    $('#discount-input').val('');
    $('#balance').val('');
    $('#cash-input').val('');
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

function loadOrders() {
    $('#cart-tbody').empty();

    order_db.map((item,index) =>{
        let id = item.id;
        let name = item.name;
        let qty = item.price;
        let price = item.qty;
        let buyingQty = item.buyingQty;
        let total = buyingQty*price;

        let data = `<tr class="table-row">
                <td>${id}</td>
                <td>${name}</td>
                <td>${qty}</td>
                <td>${price}</td>
                <td>${total}</td>
                <td> 
                    <button class="table-remove-btn">
                          <i class=" bi bi-trash"></i>
                    </button>
                </td>
        </tr>`
        $('#cart-tbody').append(data);
        console.log(order_db);
    })
}
$('#add_to_cart').on('click', function () {
    let itemId = $('#inputItemId').val();
    let itemName = $('#itemName').val();
    let itemQty = parseInt($('#itemQty').val());
    let itemPrice = parseFloat($('#itemPrice').val());
    let buyingQty = parseInt($('#buyingQty').val());

    if ($('#date').val() === '' || $('#inputCustomerId').val() === '' || $('#inputCustomerName').val() === '' ||
        itemId === '' || itemName === '' || isNaN(itemQty) || isNaN(itemPrice) || isNaN(buyingQty)) {
        Swal.fire({
            icon: 'error',
            title: 'Complete All Fields',
            text: 'You must complete all the fields before adding to cart.',
        });
        return;
    }

    if (itemQty < buyingQty || buyingQty <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'Insufficient Quantity',
            text: 'Insufficient item quantity. Please check the available quantity.',
        });
        return;
    }

    let existingItem = order_db.find(item => item.id === itemId);
    if (existingItem) {
        existingItem.buyingQty += buyingQty;
    } else {
        let order_data = new OrderModel(itemId, itemName, itemQty, itemPrice, buyingQty);
        order_db.push(order_data);
    }

    loadOrders();
    setTotal();
});


$(document).on('click', '.table-remove-btn', function () {
    const itemId = $(this).closest('tr').find('td:first').text().trim();
    const index = order_db.findIndex(item => item.id === itemId);

    if (index !== -1) {
        order_db.splice(index, 1);
        loadOrders();
        setTotal();
    }
});

function setTotal() {
    let total = 0;
    order_db.forEach(order => {
        total += parseFloat(order.qty) * parseInt(order.buyingQty);
    });
    $('#total-price').text('Rs/= '+ total.toFixed(2));
}

function setSubTotal() {
    let total = 0;

    order_db.forEach(order => {
        total += parseFloat(order.qty) * parseInt(order.buyingQty);
    });
    console.log("total ====== " + total);

    let discount = parseFloat($('#discount-input').val()) || 0;
    console.log("discount ====== " + discount);

    let subTotal = total - (discount / 100 * total);
    $('#subtotal').text('Rs/= ' + subTotal.toFixed(2));
    console.log("subTotal ====== " + subTotal);
}

$('#discount-input').on('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        setSubTotal();
    }
});

$('#place-order').on('click',function () {
    setTotal();
});

$('#cash-input').on('keydown', function (e) {
    if (e.key === 'Enter') {
        const cash = parseFloat($(this).val()) || 0;

        const totalText = $('#subtotal').text();
        console.log(totalText);
        const total = parseFloat(totalText.replace(/[^\d.]/g, '')) || 0;

        if (cash < total) {
            alert('Insufficient cash! It must be equal to or greater than the total.');
            $('#balance').val('0.00');
        } else {
            const balance = cash - total;
            $('#balance').val(balance.toFixed(2));
        }
    }
});

function reduceQty() {
    order_db.forEach(order => {
        const matching = item_db.find(dbItem => dbItem.id === order.id);
        if (matching){
            matching.qty -= parseInt(order.buyingQty);
        }
    });
}

$('#complete').on('click', function () {
    let o_id = $('#order_id').val();
    let cus_id = $('#inputCustomerId').val();
    let i_id = $('#inputItemId').val();
    let qty = $('#buyingQty').val();
    let price = $('#itemPrice').val();
    let date = $('#date').val();

    let orderDetailData = new OrderDetailsModel(o_id, cus_id, i_id, qty, price, date);
    order_detail_db.push(orderDetailData);

    console.log(orderDetailData);
    console.log(order_detail_db);

    let summary = '';
    let total = 0;

    order_db.forEach((order, index) => {
        const itemTotal = parseFloat(order.qty) * parseInt(order.buyingQty);
        total += itemTotal;
        summary += `${index + 1}. ${order.name} - ${order.buyingQty} x Rs.${order.qty} = Rs.${itemTotal.toFixed(2)}<br>`;
    });

    const discount = parseFloat($('#discount-input').val()) || 0;
    const discountAmount = (total * discount) / 100;
    const subtotal = total - discountAmount;
    const cash = parseFloat($('#cash-input').val()) || 0;
    const balance = cash - subtotal;

    summary += `<hr><b>Total:</b> Rs.${total.toFixed(2)}<br>`;
    summary += `<b>Discount:</b> ${discount}% (Rs.${discountAmount.toFixed(2)})<br>`;
    summary += `<b>Subtotal:</b> Rs.${subtotal.toFixed(2)}<br>`;
    summary += `<b>Cash:</b> Rs.${cash.toFixed(2)}<br>`;
    summary += `<b>Balance:</b> Rs.${balance.toFixed(2)}`;

    if (order_db.length === 0 || !discount || !cash) {
        Swal.fire({
            icon: 'error',
            title: 'Missing Information',
            text: 'Please fill in all fields and add at least one item to the order.',
        });
        return;
    }

    Swal.fire({
        title: '🧾 Order Summary',
        html: summary,
        icon: 'success',
        confirmButtonText: 'OK',
        width: 600
    }).then((result) => {
        if (result.isConfirmed) {
            clearFeilds();
            reduceQty();
            $('#cart-tbody').empty();
        }
    });

});






