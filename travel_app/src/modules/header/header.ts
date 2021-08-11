import { api } from "../utils/api";
import * as utils from "../utils/utilFunctions";
import { zk } from "../../lib/zk";
import template from "./navBar-template.html";
import { Trip } from "../trips/trips";

export class Header {
  trips;
  messages;
  endPoint = "/ajax/trips";
  insertNode = "#header";
  html;
  currentTrip;
  g;
  constructor() {
    this.trips = zk.makeObservable([]);
    this.messages = zk.makeObservable([]);
    this.g = utils.g;
  }
  async get() {
    //get data through fetch
    var data = await api.get(this.endPoint);
    while (this.trips.length > 0) {
      this.trips.pop();
    }
    if (location.hash != "#trips") {
      if (data.length === 0) {
        var element = document.querySelector("#noTrips");
        if (element instanceof HTMLElement) {
          element.hidden = false;
        }
      } else if (!this.g.trip.isDefined) {
        element = document.querySelector("#selectTrip");
        if (element instanceof HTMLElement) {
          element.hidden = false;
        }
      } else {
        element = document.querySelector("#noTrips");
        if (element instanceof HTMLElement) {
          element.hidden = true;
        }
        element = document.querySelector("#selectTrip");
        if (element instanceof HTMLElement) {
          element.hidden = true;
        }
      }
    }

    for (let item of data) {
      if (item.id === utils.g.trip.id) {
        utils.g.trip.name = item.name;
      }
      item.href = "#trip/" + item.id;
      this.trips.push(item);
    }
  }
  async init() {
    document.querySelector(this.insertNode).innerHTML = template;
    this.html = document.querySelector(this.insertNode);
    zk.initiateModel(this, this.html);

    this.get();
  }
  async updateTripName() {
    await this.get();
    let trip: Trip = this.trips.find(
      // must use non-strict equivalence
      (trip: Trip) => trip.id == utils.g.trip.id
    );
    if (typeof trip != "undefined") {
      utils.g.trip.name = trip.name;
    }
  }
}

export var header = new Header();
