var workdir =  "/static/modules/tripBuilder/modal"
export class Modal {
    fields
    title
    fieldContainer
    html
    target
    parent
    constructor(parent, fields, title, target, update) {
        

        this.target = target ? target : {}
        for (let field of fields) {
            // undefined, or value of target
            if (target) {
                if (field.key in target) {
                    field.value = target[field.key]
                }
            }
            
            else {
                field.value = undefined
            }
            field.id = `modal-${field.key}`
        }
        console.log('fieds', fields)
        this.fields = new zk.ObservableObject(fields)
        this.title = title
        this.parent = parent
        this.update = update
    }

    async render(obj) {
        var template = await fetch(`${workdir}/modal-template.html`, { headers: { "Content-Type": "text/html" } })
        var text = await template.text()
        this.html = document.createElement('div')
        this.html.innerHTML = text
        document.querySelector(this.parent.containerId).append(this.html)
        if (!this.update) {
            document.querySelector('#deleteItem').remove()
        }

        this.fieldContainer = document.querySelector("#model-body-container")

        zk.initiateModel(this, this.html)
    }


    async delete () {
        if (this.target) {
            this.parent.deleteItem(this.target)
            this.close()


        }
    }

    showCreate() {
        this.clear()
        this.show()
    }

    close () {
        this.html.remove()
    }


    async save () {

        for (let field of this.fields) {
            key = field.key
            this.target[key] = field.value
            if (field.type == "date") {
                target[key] = new Date(this.formModel.tempObj[key])
            }


        }
        if (this.update) {
            try {
                this.target.update()
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