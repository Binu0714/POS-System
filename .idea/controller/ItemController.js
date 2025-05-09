import {customer_db, item_db} from "../db/db.js";
import ItemModel from "../model/ItemModel.js";

function nextId() {
    let id;

    if (item_db.length>0){
        const lastId = item_db[item_db.length-1].id;
        id = parseInt(lastId.slice(1))+1;
        id = 'I'+id.toString().padStart(3,'0');
    }else {
        id = 'I001';
    }
    return id;
}

function loadItems() {
    $('#item-tbody').empty();
    item_db.map((item,index)=>{
        let id = item.id;
        let name = item.name;
        let qty = item.qty;
        let price = item.price;

        let data = `<tr class="table-row">
                <td>${id}</td>
                <td>${name}</td>
                <td>${qty}</td>
                <td>${price}</td>
        </tr>`
        $('#item-tbody').append(data);
    })
}

$('#item-save').on('click',function () {
    let id = nextId();
    let name = $('#i_name').val();
    let qty = $('#i_qty').val();
    let price = $('#i_price').val();

    let item_data = new ItemModel(id,name,qty,price);
    item_db.push(item_data);

    alert('Item Saved Successfully');

    loadItems();
    nextId();

});
