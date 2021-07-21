import { Modal } from "../modal/modal.js";
import {RestaurantsController,Restaurant} from "./restaurant.js"

export class RestaurantModal extends Modal {
    workdir = "/static/modules/tripBuilder/restaurants"
    templateFile = "restaurantModal-template.html"
    tempObj
    destination
    constructor(parent, fields, title, target, update) {
        super(parent, fields, title, target, update)
        this.tempObj = {}
        for (let field of fields){
            this.tempObj[field.key] = (target)? target[field.key] : undefined
        }
        this.tempObj = new zk.ObservableObject(this.tempObj)
        if (target) {
            Object.assign(this.tempObj, target)
        }
        this.destination = parent.destination

    }
    
    async save () {

        
        for (let field of this.fields) {
            
            if (field.type == "date") {
                try {
                    this.tempObj[key] = new Date(this.tempObj[key])
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
                this.parent.updateItem(this.target, this.tempObj)
            }
            catch (err) {
                console.error("error: ", err.message)
            }
            finally {
                this.close()
                return
            }

        }

        this.parent.appendItem(this.tempObj)

        this.close()
    }
    
    
}