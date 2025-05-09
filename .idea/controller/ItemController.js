import {item_db} from "../db/db.js";
import ItemModel from "../model/ItemModel.js";

function nextId() {
    let id;

    if (item_db.length>0){
        const lastId = item_db[item_db.length-1].item_id;
        id = parseInt(lastId.slice(1))+1;
        id = 'I'+id.toString().padStart(3,'0');
    }else {
        id = 'I001';
    }
    return id;
}

function loadItems(){
    $('#item-tbody').empty();
    item_db.map((item,index)=>{
        let id = item.item_id;
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
