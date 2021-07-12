import {api} from '../utils/api.js'
import * as utils from '../utils/utilFunctions.js'


export class Header {
    trips
    messages
    endPoint = "/ajax/trips"
    insertNode = "#header"
    workdir = "/static/modules/header"
    template = "navBar-template.html"
    html
    currentTrip 
    g
    constructor(){
        this.trips = new zk.ObservableObject([])
        this.messages = new zk.ObservableObject([])
        this.g = utils.g
        console.log(utils.g.trip.isDefined)
    }
   async get() {

        //get data through fetch
        var data = await api.get(this.endPoint, "GET")
        while (this.trips.length > 0) {
            this.trips.pop()
        }
        for (let item of data) {
            if (item.id == utils.g.trip.id) {
                utils.g.trip.name = item.name
                console.log(utils.g)

            }
            item.href = '#trip/' + item.id
            this.trips.push(item)
        } 
    
   }
   async init () {
        var template = await fetch(`${this.workdir}/${this.template}`, { headers: { "Content-Type": "text/html" } })
        var text = await template.text()
        document.querySelector(this.insertNode).innerHTML = text
        this.html = document.querySelector(this.insertNode)
        zk.initiateModel(this, this.html)
        this.get()
   }
   async updateTripName() {
       await this.get()
       let trip = this.trips.find(trip => trip.id == utils.g.trip.id)
       utils.g.trip.name = trip.name
   }
}