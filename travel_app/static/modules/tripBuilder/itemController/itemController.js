import {api} from "../../utils/api.js"
import {Modal} from "../modal/modal.js"

// constructor function for a item object

var workdir =  "/static/modules/tripBuilder/destinations"
export class Item {
    constructor( endPoint) {

        var that = this
        
        this.endPoint = endPoint
        this.update = async function () {
            var data = JSON.stringify(this)
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
            var data = JSON.stringify(this)
            // try {
            var response = await api.post(this.endPoint, data)
            this.id = response.id
            return response
        }

        // this.stringify = function () {
        //     let obj = {}
        //     console.log(this)
        //     for (let field of this.fields) {
        //         obj[field.key] = this[field.key]
        //     }
        //     obj.id = (null || this.id)
        //     return JSON.stringify(obj)
        // }
        this.delete = async function () {
            var body = JSON.stringify(this)
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
    modalClass = Modal
    
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
        
    }
    async init () {

        var template = await fetch(`${this.workdir}/${this.template}`, { headers: { "Content-Type": "text/html" } })
        var text = await template.text()
        document.querySelector(this.insertNode).innerHTML = text
        this.html = document.querySelector(this.containerId)
        zk.initiateModel(this, this.html)
        await this.get()
    }
    async get () {

        //get data through fetch
        var data = await api.get(this.endPoint, "GET")

        this.reset()
        for (let item of data) {
            let itemObject = new this.itemClass(this.endPoint)
            Object.assign(itemObject,item)
            this.itemList.push(itemObject)
        }
    }
    reset () {
        // Remove current destinations from list
        while (this.itemList.length > 0) {
            this.itemList.pop()
        }
    }
    createItem() {

        var modal = new this.modalClass(this, JSON.parse(JSON.stringify(this.fields)), this.title)
        console.log('source fields', this.fields)
        modal.render()
    }
    editItem (item) {
        var modal = new this.modalClass(this, this.fields, this.title, item, true)
        modal.render()
    }
    async appendItem (item) {
            let itemObject = new this.itemClass(this.endPoint)
            Object.assign(itemObject,item)
            
            try {
                var id = await itemObject.save()
               
            }
            catch (err) {
                console.error(err.message)
            };
            this.itemList.push(itemObject)
            this.onListChange()
        }
    // abstract method
    onListChange() {
        return true
    }
    async updateItem (item) {
        await item.update()
        this.onListChange()
       
    }
    async deleteItem (target) {
        let index = this.itemList.findIndex(x => x.id == target.id)
        try {
            let status = await target.delete()
            
            if (status.ok) {
                this.itemList.splice(index, 1)
                this.onListChange()
            }
        }
        catch (err){
            console.error("error", err.message)
        }
     
            
            
        
    }
}



