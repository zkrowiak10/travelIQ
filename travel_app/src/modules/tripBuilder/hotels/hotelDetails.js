var workdir =  "/static/modules/tripBuilder/hotels"

export class DetailsComponent {

    html
    fields
    title
    target
    templateFile
    update
    constructor(controller, fields, title, target, targetElement, templateFile, update) {

        this.fields = new zk.ObservableObject(fields)
        this.title =  title
        this.html
        this.target = (target) ? target : {}
        this.templateFile = templateFile
        this.update = new zk.ObservableObject(update)
        this.targetElement = targetElement
        this.controller = controller
    }

    async render() {
            var template = await fetch(`${workdir}/${this.templateFile}`, { headers: { "Content-Type": "text/html" } })
            var text = await template.text()
            this.html = document.querySelector(this.targetElement)
            this.html.innerHTML = text

            zk.initiateModel(this, this.html)
        }


    async delete () {
        if (target) {
            parent.deleteItem(target)
            this.close()
                }
        }

    showCreate() {
        this.clear()
        this.show()
     }

     close() {
        this.html.remove()
    }


     async save () {

        for (let field of that.formModel.fields) {
            key = field.key
            target[key] = that.formModel.tempObj[key]
            if (field.type == "date") {
                target[key] = new Date(that.formModel.tempObj[key])
            }


            }
        if (update) {
            try {
                target.update()
            }
            catch (err) {
                console.error("error: ", err.message)
            }
            finally {
                this.close()
                return
            }

        }



    }
}