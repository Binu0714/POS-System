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

