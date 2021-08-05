import { api } from "../../utils/api.js";
import { Modal } from "../modal/modal.js";
import { zk } from "../../../lib/zk.js";
var workdir = "/static/modules/tripBuilder/destinations";
export class Item {
    constructor() { }
    async update() {
        var data = JSON.stringify(this);
        var endPoint = `${this.endPoint}/${this.id}`;
        var response = await api.patch(endPoint, data);
        // will need to process potential erros down the road
        if (response.status != 200) {
            alert("something went wrong");
        }
    }
    //creates new item on server and returns json of created resource
    // with id attribute
    async save() {
        var data = JSON.stringify(this);
        // try {
        var response = await api.post(this.endPoint, data);
        this.id = response.id;
        return response;
    }
    async delete() {
        var body = JSON.stringify(this);
        var endPoint = `${this.endPoint}/${this.id}`;
        var response = await api.delete(endPoint, body);
        if (response.status != 200) {
            throw Error("Resource not deleted");
        }
        return response;
    }
}
// Abstract handlerfor item collection
export class ItemController {
    constructor() {
        // Item creation/editing is defaulted to use a modal. This can be overridden in
        // descendents
        this.itemList = zk.makeObservable([]);
        this.modalClass = Modal;
    }
    async init() {
        var template = await fetch(`${this.workdir}/${this.template}`, {
            headers: { "Content-Type": "text/html" },
        });
        var text = await template.text();
        document.querySelector(this.insertNode).innerHTML = text;
        this.html = document.querySelector(this.containerId);
        zk.initiateModel(this, this.html);
        await this.get();
    }
    async get() {
        //get data through fetch
        var data = await api.get(this.endPoint);
        this.reset();
        for (let item of data) {
            let itemObject = new this.itemClass();
            Object.assign(itemObject, item);
            this.itemList.push(itemObject);
        }
    }
    reset() {
        // Remove current destinations from list
        while (this.itemList.length > 0) {
            this.itemList.pop();
        }
    }
    createItem() {
        var modal = new this.modalClass(this, this.fields, this.title, false);
        console.log("source fields", this.fields);
        modal.render();
    }
    editItem(item) {
        var modal = new this.modalClass(this, this.fields, this.title, true, item);
        modal.render();
    }
    async appendItem(item) {
        let itemObject = new this.itemClass();
        Object.assign(itemObject, item);
        try {
            var id = await itemObject.save();
        }
        catch (err) {
            console.error(err.message);
        }
        this.itemList.push(itemObject);
        this.onListChange();
    }
    // abstract optional callback
    onListChange() {
        return;
    }
    async updateItem(item) {
        await item.update();
        this.onListChange();
    }
    async deleteItem(target) {
        let index = this.itemList.findIndex((x) => x.id == target.id);
        try {
            let status = await target.delete();
            if (status.ok) {
                this.itemList.splice(index, 1);
                this.onListChange();
            }
        }
        catch (err) {
            console.error("error", err.message);
        }
    }
}
