import { zk } from "../../../lib/zk.js";
var workdir = "/static/modules/tripBuilder/hotels";
export class DetailsComponent {
    constructor(controller, fields, title, target, targetElement, templateFile, update) {
        this.fields = zk.makeObservable(fields);
        this.title = title;
        this.html;
        this.target = target ? target : {};
        this.templateFile = templateFile;
        this.update = zk.makeObservable(update);
        this.targetElement = targetElement;
        this.controller = controller;
    }
    async render() {
        var template = await fetch(`${workdir}/${this.templateFile}`, {
            headers: { "Content-Type": "text/html" },
        });
        var text = await template.text();
        this.html = document.querySelector(this.targetElement);
        this.html.innerHTML = text;
        zk.initiateModel(this, this.html);
    }
    async delete() {
        if (this.target) {
            this.controller.deleteItem(this.target);
            this.close();
        }
    }
    close() {
        this.html.innerHTML = "";
    }
    async save() {
        for (let field of this.fields) {
            let key = field.key;
            if (field.type == "date") {
                this.target[key] = new Date(this.target[key]);
            }
        }
        if (this.update) {
            try {
                this.target.update();
            }
            catch (err) {
                console.error("error: ", err.message);
            }
            finally {
                this.close();
                return;
            }
        }
    }
}
