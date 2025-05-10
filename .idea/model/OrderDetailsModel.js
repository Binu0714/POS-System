export default class OrderDetailsModel{
    constructor(order_id,cus_id,item_id,qty,price) {
        this.order_id = order_id;
        this.cus_id = cus_id;
        this.item_id = item_id;
        this.qty = qty;
        this.price = price;
    }
}