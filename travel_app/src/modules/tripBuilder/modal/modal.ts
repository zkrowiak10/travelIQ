var workdir =  "/static/modules/tripBuilder/modal"
import type {fieldsArray, } from '../itemController/itemController.js'
import {ItemController, Item} from '../itemController/itemController.js'
import {zk} from '../../../lib/zk.js'

interface Iparent extends ItemController{}

export class Modal {
    html: HTMLDivElement
    templateFile = "modal-template.html"
    workdir = "/static/modules/tripBuilder/modal"
    target? : Item 
    constructor(
        public parent: ItemController,
        public fields: fieldsArray,
        public title: string, 
        public update: boolean, 
        target? : Item 
    ){
        this.target = target ? target : new parent.itemClass()
        for (let field of this.fields) {
            // undefined, or value of target
            if (target) {
                if (field.key in target) {
                    field.value = target[field.key]
                }
            }
            if (!update) {
                field.value = undefined
            }
            field.id = `modal-${field.key}`
        }
        
        this.fields = zk.makeObservable(fields)
  
    }

    async render() {
        var template = await fetch(`${this.workdir}/${this.templateFile}`, { headers: { "Content-Type": "text/html" } })
        var text = await template.text()
        this.html = document.createElement('div')
        this.html.innerHTML = text
        document.querySelector(this.parent.containerId).append(this.html)
        if (!this.update) {
            document.querySelector('#deleteItem').remove()
        }

        zk.initiateModel(this, this.html)
    }

    async delete () {
        if (this.target) {
            this.parent.deleteItem(this.target)
            this.close()
        }
    }

    close () {
        this.html.remove()
    }

    async save () {

        for (let field of this.fields) {
            let key = field.key  
            this.target[key] = field.value
            if (field.type == "date") {
                try {
                    this.target[key] = new Date(field.value)
                }
                catch (err) {
                    console.error(err.message)
                    alert('Error, item not saved')
                    this.close()
                }
            }


        }
        if (this.update) {
            try {
                this.parent.updateItem(this.target)
            }
            catch (err) {
                console.error("error: ", err.message)
            }
            finally {
                this.close()
                return
            }

        }

        this.parent.appendItem(this.target)

        this.close()
    }  
}