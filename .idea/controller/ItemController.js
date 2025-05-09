import {customer_db, item_db} from "../db/db.js";
import ItemModel from "../model/ItemModel.js";

let id;
let rowIndex;

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

    const namePattern = /^[A-Za-z0-9 ]{2,50}$/;
    const qtyPattern = /^[1-9][0-9]*$/;
    const pricePattern = /^\d+(\.\d{1,2})?$/;

    if (name=='' || qty=='' || price==''){
        alert('All fields are required');
        return;
    }

    if (!namePattern.test(name)) {
        alert('Invalid name format.');
        return;
    }

    if (!qtyPattern.test(qty)) {
        alert('Invalid quantity format.');
        return;
    }

    if (!pricePattern.test(price)) {
        alert('Invalid price format.Must be a number with up to 2 decimal places');
        return;
    }

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

$('#item-update').on('click',function () {
    let name = $('#i_name').val();
    let qty = $('#i_qty').val();
    let price = $('#i_price').val();

    if (name=='' || qty=='' || price==''){
        $('#item-update').prop().disabled = true;
    }else {
        let item_data = new ItemModel(id, name, qty, price);
        item_db.splice(item_db.findIndex(item => item.id == id), 1, item_data);

        alert('Item Updated Successfully');

        loadItems();
        clearFeilds();
    }
});

$('#item-delete').on('click',function () {
    let name = $('#i_name').val();
    let qty = $('#i_qty').val();
    let price = $('#i_price').val();

    if (id=='' || name=='' || qty=='' || price==''){
        alert('Please select a item to delete');
        return;
    }else {
        item_db.splice(rowIndex, 1);
        alert('Item Deleted Successfully');
        loadItems();
        clearFeilds();
    }
});
