import { ItemController, Item } from "../itemController/itemController";
import * as hotels from "../hotels/hotels";
import * as utils from "../../utils/utilFunctions";
import * as restaurants from "../restaurants/restaurant";
import { api } from "../../utils/api";
import template from "./destinations-template.html";
import styles from "./destination.module.css";

export class Destination extends Item {
  fields = [
    { type: "text", key: "name", pretty: "Name" },
    { type: "number", key: "days_there", pretty: "Days There" },
    { type: "textarea", key: "notes", pretty: "Notes" },
    { type: "number", key: "trip_order", pretty: "Order in Trip" },
  ];
  focused = false;
  trip_id: number = utils.g.trip.id;
  name: string;
  days_there: number;
  notes: string;
  trip_order: number;
  id: number;
  endPoint = `/ajax/trip/${this.trip_id}/destination`;
  constructor() {
    super();
  }
  toggleFocus(item: this) {
    item.focused = !item.focused;
  }
  get links() {
    var linkPaths = `#trip/${utils.g.trip.id}/destination/${this.id}`;
    var links = {
      hotels: `${linkPaths}/hotels`,
      restaurants: `${linkPaths}/restaurants`,
      activities: `${linkPaths}/activities`,
    };
    return links;
  }
  async save() {
    var data = JSON.stringify(this);
    // try {
    var response = await api.post(this.endPoint, data);
    this.id = response.id;
    return response;
  }
}
export class DestinationsController extends ItemController {
  fields = [
    { type: "text", key: "name", pretty: "Name" },
    { type: "number", key: "days_there", pretty: "Days There" },
    { type: "textarea", key: "notes", pretty: "Notes" },
    { type: "number", key: "trip_order", pretty: "Order in Trip" },
  ];
  endPoint = "/ajax/trip/" + utils.g.trip.id + "/destinations";
  containerId = "#destinations";
  title = "Destinations";
  template = template;
  workdir = "/static/modules/tripBuilder/destinations";
  insertNode = "#left-sidebar";
  itemClass = Destination;
  constructor() {
    super();
  }
  findDestinationByID(destID) {
    return this.itemList.find((dest) => dest.id == destID);
  }
}

// receives /destinations or /destination/<id>/etc...
export async function route(hashArray) {
  let next = hashArray.shift();

  if (!next) {
    location.hash = location.hash + "/destinations";
    return;
  }
  var destinationsController = new DestinationsController();
  await destinationsController.init();

  if (next === "destinations") {
    return 200;
  }
  if (next === "destination") {
    next = hashArray.shift();
  } else {
    console.log(next);
  }
  let destination = destinationsController.findDestinationByID(next);
  if (!destination) {
    console.log("no destination at current hash");
  }
  destination.focused = true;
  next = hashArray.shift();
  if (!next) {
    return 200;
  }
  switch (next) {
    case "hotels":
    case "hotel":
      hotels.route(hashArray, destination);
      break;
    case "restaurants":
    case "restaurant":
      restaurants.route(hashArray, destination);
      break;
  }
}
