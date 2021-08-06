// import { Modal } from "../modal/modal";
// import {Hotel} from "./hotels.js"

// class HotelModal extends Modal {
//     workdir = "static/modules/tripBuilder/hotels"
//     templateFile = "hotelModal-template.html"
//     tempObj
//     constructor(parent, fields, title, target, update) {
//         super(parent, fields, title, target, update)
//         this.tempObj = new Hotel()
//         if (target) {
//             Object.assign(this.tempObj, target)
//         }

//     }

//     async save () {

//         for (let field of this.fields) {
//             var key = field.key
//             this.target[key] = field.value
//             if (field.type === "date") {
//                 try {
//                     this.target[key] = new Date(field.value)
//                 }
//                 catch (err) {
//                     console.error(err.message)
//                     alert('Error, item not saved')
//                     this.close()
//                 }
//             }

//         }
//         if (this.update) {
//             try {
//                 this.target.update()
//             }
//             catch (err) {
//                 console.error("error: ", err.message)
//             }
//             finally {
//                 this.close()
//                 return
//             }

//         }

//         this.parent.appendItem(this.target)

//         this.close()
//     }

// }
