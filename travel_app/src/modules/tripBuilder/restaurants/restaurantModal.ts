import { Modal } from "../modal/modal";
import { RestaurantsController, Restaurant } from "./restaurant";
import { zk } from "../../../lib/zk";
import {
  ItemController,
  fieldsArray,
  Item,
} from "../itemController/itemController";
export class RestaurantModal extends Modal {
  workdir = "/static/modules/tripBuilder/restaurants";
  templateFile = "restaurantModal-template.html";
  destination;
  parent;
  tempObj = {};
  constructor(
    parent: ItemController,
    fields: fieldsArray,
    title: string,
    update: boolean,
    target: Item
  ) {
    super(parent, fields, title, update, target);
    if (!(parent instanceof RestaurantsController)) {
      throw new Error(
        "Cannot create restaurante modal with non-Restaurant controller"
      );
    }
    for (let field of fields) {
      this.tempObj[field.key] = target ? target[field.key] : undefined;
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
      if (field.type === "date") {
        try {
          this.tempObj[key] = new Date(this.tempObj[key]);
        } catch (err) {
          console.error(err.message);
          alert("Error, item not saved");
          this.close();
        }
      }
    }
    if (this.update) {
      try {
        this.parent.updateItem(this.target, this.tempObj);
      } catch (err) {
        console.error("error: ", err.message);
      } finally {
        this.close();
        return;
      }
    }

    this.parent.appendItem(this.tempObj);

    this.close();
  }
}
