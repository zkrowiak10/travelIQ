var workdir = "/static/modules/tripBuilder/modal"

// Creates a popup to add/edit data
export class Modal {
    fields
    title
    html
    target
    parent
    templateFile = "modal-template.html"
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
        this.fields = new zk.ObservableObject(fields)
        this.title = title
        this.parent = parent
        this.update = update
        this.workdir = workdir
    }

    async render(obj) {
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


    async delete() {
        if (this.target) {
            this.parent.deleteItem(this.target)
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

    async save() {
        for (let field of this.fields) {
            let key = field.key

            // this enables one level of object nesting for generic form use. For deeper nesting,
            // I would prefer to use sub-components.
            if (field.parent) {
                if (!this.target[field.parent]) {
                    this.target[field.parent] = {}
                }

                this.target[field.parent][key] = field.value

                continue
            }
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