import {api} from '../utils/api.js'
export class Header {
    trips
    messages
    endPoint = "/ajax/trips"
    insertNode = "#header"
    workdir = "/static/modules/header"
    template = "navBar-template.html"
    html
    constructor(){
        this.trips = new zk.ObservableObject([])
        this.messages = new zk.ObservableObject([])
    }
   async get() {

        //get data through fetch
        var data = await api.get(this.endPoint, "GET")

        
        for (let item of data) {
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
}