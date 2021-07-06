import {api} from "../../utils/api.js"
import {Modal} from "../modal/modal.js"

// constructor function for a item object

var workdir =  "/static/modules/tripBuilder/destinations"
export class Item {
    constructor(fields) {

        var that = this
        this.fields = fields

        this.update = async function () {
            var data = this.stringify() 
            var response = await api.patch(itemController.endPoint, data)
            // will need to process potential erros down the road
            if (response.status != 200) {
                alert('something went wrong')
            }

        },

            //creates new item on server and returns json of created resource
            // with id attribute
        this.save = async function () {
            var data = this.stringify()
            // try {
            var response = await api.post(itemController.endPoint, data)
            that.id = response.id
            return response
        }

        this.stringify = function () {
            let obj = {}
            for (let field of this.itemController.fields) {
                obj[field.key] = this[field.key]
            }
            return JSON.stringify(obj)
        }
        this.delete = async function () {
            var body = this.stringify() 
            var response = await api.delete(itemController.endPoint, body)
            if (response.status != 200) {
                throw Error("Resource not deleted")
            }
            this.itemController.deleteItem(that.id)
        }
    }
}

// collection handler for item collection
export class ItemController {
    constructor() {
        var that = this

        this.itemList = new zk.ObservableObject([])
        this.endPoint
        this.fields = []
        this.title 
        this.containerId 
        this.html
        this.template
        this.workdir
        this.init = async function () {

            var template = await fetch(`${this.workdir}/${this.template}`, { headers: { "Content-Type": "text/html" } })
            var text = await template.text()
            document.querySelector("#tabContent").innerHTML = text
            this.html = document.querySelector(this.containerId)
            zk.initiateModel(this, this.html)
            this.get()
        }
        this.get = async function () {

            //get data through fetch
            var data = await api.get(this.endPoint, "GET")

            this.reset()
            for (let item of data) {
                let itemObject = new Item(this.fields)
                Object.assign(itemObject,item)
                this.itemList.push(itemObject)
            }
        }
        this.reset = function () {
            // Remove current destinations from list
            while (this.itemList.length > 0) {
                this.itemList.pop()
            }
        }
        this.createItem = function () {

            var modal = new Modal(that, JSON.parse(JSON.stringify(that.fields)), that.title)
            modal.render()
        }
        this.editItem = function (item) {
            var modal = new Modal(that, that.fields, that.title, true)
            modal.render()
        }
        this.appendItem = async function (item) {
            let itemObject = new Item(this.fields)
            Object.assign(itemObject,item)
            
            try {
                var id = await itemObject.save()
               itemObject.id = id
            }
            catch (err) {
                console.error(err.message)
            };
            that.itemList.push(itemObject)
        }
        this.deleteItem = async function (id) {
            let index = this.itemList.findIndex(x => x.id == id)
            this.itemList.shift(index, 1)
        }
    }
}



