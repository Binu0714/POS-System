export default class OrderModel{
    constructor(id,name,price,qty,buyingQty) {
        this.id = id;
        this.name = name;
        this.qty = qty;
        this.price = price;
        this.buyingQty = buyingQty;
    }
}