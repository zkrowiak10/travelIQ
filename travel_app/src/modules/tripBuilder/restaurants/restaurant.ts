import { api } from "../../utils/api";
import { Destination } from "../destinations/destinations";
import { Item, ItemController } from "../itemController/itemController";
import { DetailsComponent } from "./restaurantDetails";
import { RestaurantModal } from "./restaurantModal";
import { zk } from "../../../lib/zk";
import template from "./restaurant-template.html";
// constructor function for a restaurant object

var workdir = "/static/modules/tripBuilder/restaurants";
var putEndpoint;
var getEndpoint;
export class Restaurant extends Item {
  fields = [
    { type: "text", key: "name", pretty: "Name" },
    { type: "text", key: "link", pretty: "Link" },
    {
      type: "dateTime",
      key: "reservation",
      pretty: "Reservation date and time",
    },
    { type: "text", key: "mealType", pretty: "Breakfast, Lunch or Dinner?" },
    { type: "number", key: "day", pretty: "Which day?" },
  ];
  name;
  link;
  reservation;
  mealType;
  day;
  endPoint = putEndpoint;
  constructor() {
    super();
  }
}

// collection handler for current restaurants
export class RestaurantsController extends ItemController {
  detailsTargetElement = "#restaurantDetailView";
  misFits = zk.makeObservable([]);
  itemClass = Restaurant;
  modalClass = RestaurantModal;
  fields = [
    { type: "text", key: "name", pretty: "Name" },
    { type: "text", key: "link", pretty: "Link" },
    {
      type: "dateTime",
      key: "reservation",
      pretty: "Reservation date and time",
    },
    { type: "text", key: "mealType", pretty: "Breakfast, Lunch or Dinner?" },
    { type: "number", key: "day", pretty: "Which day?" },
  ];
  title = "Create Restaurants";
  containerId = "#restaurants";
  insertNode = "#tabContent";
  template = template;
  destination: Destination;
  endPoint = getEndpoint;
  workdir = workdir;
  constructor(destination) {
    super();
    this.destination = destination;

    for (let i = 0; i < destination.days_there; i++) {
      let obj = {
        dayNumber: i + 1,
        breakfast: [],
        lunch: [],
        dinner: [],
        visible: true,
        showBreakfast: true,
        showLunch: true,
        showDinner: true,
      };
      this.itemList.push(obj);
      this.itemList.misFits = [];
    }
  }
  toggleFocus(item) {
    item.visible = !item.visible;
  }
  toggleBreakfast(item) {
    item.showBreakfast = !item.showBreakfast;
  }
  toggleLunch(item) {
    item.showLunch = !item.showLunch;
  }
  toggleDinner(item) {
    item.showDinner = !item.showDinner;
  }
  async get() {
    // get data through fetch
    var data = await api.get(this.endPoint);

    for (let item of data) {
      let itemObject = new this.itemClass();
      Object.assign(itemObject, item);
      this.addItemToModel(itemObject);
    }
  }
  addItemToModel(itemObject) {
    if (typeof itemObject.day != "undefined" && itemObject.mealType) {
      let day = itemObject.day - 1;
      this.itemList[day][itemObject.mealType].push(itemObject);
    } else {
      this.misFits.push(itemObject);
    }
  }
  showDetails(Restaurant) {
    let detailTitle = `Details for ${Restaurant.name}`;
    let detail = new DetailsComponent(
      this,
      this.fields,
      detailTitle,
      Restaurant,
      this.detailsTargetElement,
      false
    );
    detail.render();
  }
  async updateItem(target): Promise<void>;
  async updateItem(target, source?): Promise<void>;
  async updateItem(target, source?) {
    if (!source) {
      throw new Error("This");
    }
    let dayIndex = target.day - 1;
    let mealType = target.mealType;

    // find current location of object being updated and remove it
    if (typeof dayIndex != "undefined" && mealType) {
      let index = this.itemList[dayIndex][mealType].findIndex(
        (x) => x.id === target.id
      );
      this.itemList[dayIndex][mealType].splice(index, 1);
    } else {
      let index = this.misFits.findIndex((x) => x.id === target.id);
      this.misFits.splice(index, 1);
    }
    Object.assign(target, source);
    target.update();
    this.addItemToModel(target);
  }
  async appendItem(item) {
    let itemObject = new this.itemClass();
    Object.assign(itemObject, item);

    try {
      var id = await itemObject.save();
    } catch (err) {
      console.error(err.message);
    }

    this.addItemToModel(itemObject);
  }
  async deleteItem(target) {
    let dayIndex = target.day - 1;

    if (typeof dayIndex != "undefined" && target.mealType) {
      let index = this.itemList[dayIndex][target.mealType].findIndex(
        (x) => x.id === target.id
      );
    } else {
    }
    try {
      let status = await target.delete();

      if (status.ok) {
        if (typeof dayIndex != "undefined" && target.mealType) {
          let index = this.itemList[dayIndex][target.mealType].findIndex(
            (x) => x.id === target.id
          );
          this.itemList[dayIndex][target.mealType].splice(index, 1);
        } else {
          let index = this.misFits.findIndex((x) => x.id === target.id);
          this.misFits.splice(index, 1);
        }
      }
    } catch (err) {
      console.error("error", err.message);
    }
  }
}

export function route(hashArray, destination) {
  var endpointPrefix = `${destination.endPoint}/${destination.id}`;
  putEndpoint = endpointPrefix + "/restaurant";
  getEndpoint = endpointPrefix + "/restaurants";
  let controller = new RestaurantsController(destination);
  controller.init();
}
