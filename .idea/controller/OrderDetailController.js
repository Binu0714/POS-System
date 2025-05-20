import {order_db, customer_db, item_db, order_detail_db} from '../db/db.js';
import OrderDetailModel from '../model/OrderDetailModel.js';

$(document).ready(function (){

});

$('#order-search').on('click', function () {
    console.log("wada..")
    let searchOrder = $('#order-SearchBar').val().trim().toLowerCase();
    let tableBody = $('#orderDetails-tbody');
    tableBody.empty();

    if (!searchOrder) return;

    let found = false;

    order_detail_db.forEach(order => {
        if (order.order_id.toLowerCase() === searchOrder) {
            found = true;
            let row = `
                <tr>
                    <td>${order.order_id}</td> 
                    <td>${order.cus_id}</td>
                    <td>${order.item_name}</td>
                    <td>${order.qty}</td>
                    <td>${order.price}</td>
                    <td>${order.date}</td>
                </tr>
            `;
            tableBody.append(row);
        }
    });

    if (!found) {
        Swal.fire({
            icon: 'error',
            title: 'Not Found',
            text: 'No matching order found.Try Serach with OrderId'
        });
    }
});
