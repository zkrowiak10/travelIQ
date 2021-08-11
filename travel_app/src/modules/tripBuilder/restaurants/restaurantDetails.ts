import { zk } from "../../../lib/zk";
import { fieldsArray, ItemController } from "../itemController/itemController";
import { Restaurant } from "./restaurant";
import template from "./restaurantDetails-template.html";

export class DetailsComponent {
  html: HTMLElement;
  fields: fieldsArray;
  title: string;
  target: Restaurant | {};
  template: string = template;
  update: boolean;
  targetElement: string;
  controller: ItemController;
  constructor(
    controller: ItemController,
    fields: { type: string; key: string; pretty: string }[],
    title: string,
    target: Restaurant,
    targetElement: string,
    update: boolean
  ) {
    this.fields = zk.makeObservable(fields);
    this.title = title;
    this.html;
    this.target = target ? target : {};
    this.update = zk.makeObservable(update);
    this.targetElement = targetElement;
    this.controller = controller;
  }

  async render() {
    this.html = document.querySelector(this.targetElement);
    this.html.innerHTML = this.template;

    zk.initiateModel(this, this.html);
  }

  async delete() {
    if (this.target) {
      this.controller.deleteItem(this.target);
      this.close();
    }
  }
  close() {
    this.html.remove();
  }

  async save() {
    for (let field of this.fields) {
      var key = field.key;

      if (field.type === "date") {
        this.target[key] = new Date(this.target[key]);
      }
    }
    if (this.update && this.target instanceof Restaurant) {
      try {
        this.target.update();
      } catch (err) {
        console.error("error: ", err.message);
      } finally {
        this.close();
        return;
      }
    }
  }
}
