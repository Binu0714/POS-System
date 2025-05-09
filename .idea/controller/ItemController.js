import {customer_db, item_db} from "../db/db.js";
import ItemModel from "../model/ItemModel.js";

let id;

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
    clearFeilds();
});

function clearFeilds() {
    $('#i_id').val(nextId());
    $('#i_name').val('');
    $('#i_qty').val('');
    $('#i_price').val('');
}

$('#item-reset').on('click',function () {
    clearFeilds();
});

$('#item-tbody').on('click','tr',function () {
    let idx = $(this).index();
    let obj = item_db[idx];
    console.log(obj);

    id = obj.id;
    let name = obj.name;
    let qty = obj.qty;
    let price = obj.price;

    console.log(id,name,qty,price);

    $('#i_id').val(id);
    $('#i_name').val(name);
    $('#i_qty').val(qty);
    $('#i_price').val(price);
});
