var workdir =  "/static/modules/tripBuilder/modal"
export function Modal(parent, fields, title, target, update) {
    
    
    
    var that = this
    // Current framework architecture requires an object with enumerable properties 
    // as an argument to zk.ObservableObject
    this.formModel = {
        fields : fields,
        title : title,
        tempObj : {}
    }
    this.formModel = new zk.ObservableObject(this.formModel)
    this.fieldContainer
    this.html
    if (!target) {
        this,target = {}
    }
    
    
    this.render = async function(obj) {
        var template = await fetch(`${workdir}/modal-template.html`, { headers: {"Content-Type" : "text/html"}})
        var text = await template.text()
        this.html = document.createElement('div')
        this.html.innerHTML = text
        document.querySelector(parent.containerId).append(this.html)
        if (!update) {
            document.querySelector('#deleteItem').remove()
        }
        
        this.fieldContainer = document.querySelector("#model-body-container")

        
        // Todo: zk framework should be able to dynamically assign input field type.
        for (let field of fields)  {
            this.formModel.tempObj[field.key] = (target[field.key]) ? target[field.key] : undefined
            let label = document.createElement("label")
            let input = document.createElement("input")
            let br = document.createElement("br")
            input.name = field.key
            input.id = field.key
            label.innerHTML = `${field.pretty}: `
            label.setAttribute("for", input.id)
            input.setAttribute("type", field.type)
            input.setAttribute("zk-bind", `text: formModel.tempObj.${field.key}`)
            input.className = "form-control"
            
            this.fieldContainer.appendChild(label)
            this.fieldContainer.appendChild(input)
        }
        zk.initiateModel(this, this.html)
    },

  
   this.delete = async function() {
        if (target) {
            try {
                status = await target.delete()
                
            }
            catch (err){
                console.log("error", err.message)
            }
            finally {
                that.close()
            }
        }
   }

    this.showCreate= function(){
        this.clear()
        this.show()
    }

    this.close = function() {
        that.html.remove()
    }


    this.save = async function() {
       
        for (let field of that.formModel.fields) {
            key = field.key
            target[key] = that.formModel.tempObj[key]
        }
        if (update) {
            try {
                target.update()
            }
            catch (err){
                console.log("error", err.message)
            }
            finally {
                that.close()
                return
            }
            
        }
        console.log("tes")
        parent.appendItem(target)
        
        that.close()
    }
   


}