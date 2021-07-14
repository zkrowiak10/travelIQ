import {api} from "../../utils/api.js"
import {Modal} from "../modal/modal.js"

// constructor function for a item object

var workdir =  "/static/modules/tripBuilder/destinations"
export class Item {
    constructor( endPoint) {

        var that = this
        
        this.endPoint = endPoint
        this.update = async function () {
            var data = this.stringify() 
            endPoint = `${this.endPoint}/${this.id}`
            var response = await api.patch(endPoint, data)
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
            var response = await api.post(this.endPoint, data)
            this.id = response.id
            return response
        }

        this.stringify = function () {
            let obj = {}
            console.log(this)
            for (let field of this.fields) {
                obj[field.key] = this[field.key]
            }
            obj.id = (null || this.id)
            return JSON.stringify(obj)
        }
        this.delete = async function () {
            var body = this.stringify() 
            endPoint = `${this.endPoint}/${this.id}`
            var response = await api.delete(endPoint, body)
            if (response.status != 200) {
                throw Error("Resource not deleted")
            }
            return response
        }
    }
}

// collection handler for item collection
export class ItemController {
    constructor(itemClass, endPoint, fields, title, containerId, templateFile, workdir, insertNode)
    {
        var that = this
        this.itemClass = (itemClass)? itemClass : Item
        this.itemList = new zk.ObservableObject([])
        this.endPoint = endPoint
        this.fields = fields
        this.title = title
        this.containerId = containerId
        this.html
        this.template =templateFile
        this.workdir = workdir
        this.insertNode = insertNode
        this.init = async function () {

            var template = await fetch(`${this.workdir}/${this.template}`, { headers: { "Content-Type": "text/html" } })
            var text = await template.text()
            document.querySelector(this.insertNode).innerHTML = text
            this.html = document.querySelector(this.containerId)
            zk.initiateModel(this, this.html)
            await this.get()
        }
        this.get = async function () {

            //get data through fetch
            var data = await api.get(this.endPoint, "GET")

            this.reset()
            for (let item of data) {
                let itemObject = new this.itemClass(this.fields, this.endPoint)
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
            var modal = new Modal(this, that.fields, that.title, item, true)
            modal.render()
        }
        this.appendItem = async function (item) {
            let itemObject = new this.itemClass(this.fields, this.endPoint)
            Object.assign(itemObject,item)
            
            try {
                var id = await itemObject.save()
               
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



