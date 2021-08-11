import {
  ItemController,
  Item,
} from "../tripBuilder/itemController/itemController";
import { header } from "../header/header";
import * as utils from "../utils/utilFunctions";
import template from "./trips-template.html";
export class Trip extends Item {
  endPoint = "/ajax/trip";
  name: string;
  start_date: Date;
  end_date: Date;
  constructor() {
    super();
  }
}

export class TripsController extends ItemController {
  endPoint = "/ajax/trips";
  containerId = "#tabContent";
  title = "Create Trips";
  itemClass = Trip;
  insertNode = "#tabContent";
  template = template;
  workdir = "/static/modules/trips";
  fields = [
    { type: "text", key: "name", pretty: "Name of Trip" }, //go back to fix date issue
    { type: "date", key: "start_date", pretty: "Departure Date" },
    { type: "date", key: "end_date", pretty: "Return Date" },
  ];
  constructor() {
    super();
  }
  async onListChange() {
    await header.get();
    utils.g.trip.isDefined = false;
    utils.g.trip.name = "";
    utils.g.trip.id = undefined;
  }
}
