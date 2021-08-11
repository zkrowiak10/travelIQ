import { zk } from "../../../lib/zk";
import { fieldsArray, ItemController } from "../itemController/itemController";
import template from "./hotelDetails-template.html";
import { Hotel } from "./hotels";
var workdir = "/static/modules/tripBuilder/hotels";

export class DetailsComponent {
  html: HTMLElement;
  fields: fieldsArray;
  title: string;
  target?: Hotel | {};
  template: string = template;
  update: boolean;
  targetElement: string;
  controller: { deleteItem: (arg0: any) => void };
  constructor(
    controller: ItemController,
    fields: { type: string; key: string; pretty: string }[],
    title: string,
    target: any,
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
    this.html.innerHTML = "";
  }

  async save() {
    for (let field of this.fields) {
      let key = field.key;
      if (field.type === "date") {
        this.target[key] = new Date(this.target[key]);
      }
    }
    if (this.update && this.target instanceof Hotel) {
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
