import { Modal } from "../modal/modal.js";
import { RestaurantsController } from "./restaurant.js";
import { zk } from '../../../lib/zk.js';
export class RestaurantModal extends Modal {
    constructor(parent, fields, title, update, target) {
        super(parent, fields, title, update, target);
        this.workdir = "/static/modules/tripBuilder/restaurants";
        this.templateFile = "restaurantModal-template.html";
        this.tempObj = {};
        if (!(parent instanceof RestaurantsController)) {
            throw new Error('Cannot create restaurante modal with non-Restaurant controller');
        }
        for (let field of fields) {
            this.tempObj[field.key] = (target) ? target[field.key] : undefined;
        }
        this.tempObj = zk.makeObservable(this.tempObj);
        if (target) {
            Object.assign(this.tempObj, target);
        }
        this.destination = parent.destination;
    }
    async save() {
        for (let field of this.fields) {
            var key = field.key;
            if (field.type == "date") {
                try {
                    this.tempObj[key] = new Date(this.tempObj[key]);
                }
                catch (err) {
                    console.error(err.message);
                    alert('Error, item not saved');
                    this.close();
                }
            }
        }
        if (this.update) {
            try {
                this.parent.updateItem(this.target, this.tempObj);
            }
            catch (err) {
                console.error("error: ", err.message);
            }
            finally {
                this.close();
                return;
            }
        }
        this.parent.appendItem(this.tempObj);
        this.close();
    }
}
