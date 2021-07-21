

/*
Master list of binding syntax:

attr: <attr>|<valueObjet>|<formatCallback>
for: key of <iterable>
text: <object>
format: <object>|<callback> 
*/

type proxyObservable = {
    _observableObject : ObservableObject
    _targetObject : any
    $parentModel : any
    $model : any
   
    
}

type SubModel = {
    subModel: any,
    node: HTMLElement
}
var zk_self = {
    root_model = undefined
}

// Function to initiate any object variables accessible to all zk objects
// Then begin recursively parsing DOM for observable elements
// Parameters
// Model: an object containing observable objects 
// Root: An html node that is the root element of all observable objects
function initiateModel(model: any, root: HTMLElement) :void {

    

    for (let object in model) {
        if(!model[object]) {continue}
        if (model[object]._observableObject) {
            model[object]._observableObject.$model = model
        }
    }

    if (!(root instanceof HTMLElement)) {
        throw new Error("Invalid argument: second parameter must be an HTML element")
    }
    ParseDOMforObservables(model,root)

}
    // Recursive function that locates and registers any html element descending from root that should be observed 
function ParseDOMforObservables(model : any, root : HTMLElement) 
{       

    var isIndependentElement : boolean

    // if HTML element contains binder
    if (root.getAttribute('zk-bind')){

        // parse the bind command
        // bind syntax is '<bindMode>: <object path'
        let zkbind = root.getAttribute('zk-bind')
        let bindingExpressions = zkbind.split(';')

        for (let binder of bindingExpressions) {

        
            let splitBinder = binder.split(":")

            if (splitBinder.length < 2) {throw new Error(`Invalid binding at: ${root}`, )}

            // isolate bindMode string and object path (getting rid of preceding white space)
            let bindMode = splitBinder[0] 
            let objectPath = splitBinder[1].trim()
            
            // Current array of valid bind modes for validity checking
            let validBindModes = ['text', 'value', 'for','date', 'on', 'format', 'checkbox', 'attr', 'hidden', 'visible', 'radio']


            // Verify that bind mode is valid
            if (!validBindModes.includes(bindMode)) 
            {
                console.error(bindMode + " is not a valid bind mode")
                continue
            } 


            // Parent object in path is expected to be an attribute of the model parameter of this function
            // Parse parent object, and add this element to the appropriate list
            let parentObject = objectPath.split('.')[0]

            // A little messy, but 'for' binders receive an argument of 'indexKey of iterable' where
            // iterable is the typical objectpaty. 
            if (bindMode === 'for') {
                parentObject = objectPath
                                .split('of')[1]
                                .trim()
                                .split('.')[0]  
            }
            
            

            // Push the element to the appropriate list 
            let boundElement = new BoundElement(root, objectPath, bindMode)

            if ((bindMode == 'on')) {
                
                registerListener(boundElement, model)
                continue
            }
            if ((bindMode == "attr")){
                parentObject = objectPath.split('|')[1].split('.')[0]
            }
            

            if (typeof parent == "undefined") {
                console.error("Invald object path at ", binder, "with model: ",model)
                continue
            }

            // populate non-observable fields just once
            if (!model[parentObject]._observableObject)  {
                if (bindMode == "value") {
                    
                    root.innerText = utils.returnTargetProperty(model, objectPath)
                    continue
                }
            }
            let observableTarget : ObservableObject
            observableTarget = model[parentObject]._observableObject
            observableTarget.registerElement(bindMode, boundElement)

            // Some binders, such as 'for' binders, create a separate tree model for all of their children
            // This array contains a list of all 'uprooting' binders
            let uprootingBinders = ['for']

            // This root becomes a new tree, so now further exploration of this branch can happen to avoid duplicate bindings
            if (uprootingBinders.includes(bindMode)) {
                
                isIndependentElement = true
            }


            }
    }

    if (isIndependentElement) {
        return
    }
    let children = root.children
    
    // iterate through children 
    walkIterator:
    for (let child of children) {
        
        if (child instanceof HTMLElement){
             // Recursively parse all children of current root element
             ParseDOMforObservables(model, child) 

        }

           
    }
}


 // instantiates a bound element storing the DOM element and the object path to which it is linked
 class BoundElement {
    DOMelement : HTMLElement
    objectPath : string
    bindMode : string
    target : proxyObservable
    property : string
    observableChildren : SubModel[]
    attr :  string
    templateNode? : HTMLElement
    iteratorKey? : string
    updateCallback : (arg : any) => void
    valueList : string[]
    constructor(DOMelement: HTMLElement, objectPath: string, bindMode: string) {
        this.DOMelement = DOMelement
        this.objectPath = objectPath
        this.bindMode = bindMode
        this.target = undefined
        this.property = undefined
        this.observableChildren = undefined
        this.attr
        this.valueList
    }
    update () {
            let value = this.target[this.property]

            if (this.updateCallback) {
                value = this.updateCallback(value)
                // TODO add configuration callbacks for date string formatting
            }
            switch (this.bindMode) {
                case ("attr"):
                    this.DOMelement.setAttribute(this.attr, value)
                    return

            }

            this.DOMelement.innerText = value 
    }
}

       
        // this method is called by the handler 'set' function so that the DOM mirrors the array on state change
        function 





        // function to register an element, perform any intialization,a nd add to appropriate array
        this.registerElement = function (bindMode, boundElement) {

            switch (bindMode) {
                case "text":
                case "checked":
                case "radio":
                case "date":
                    transmitters.push(boundElement)
                    oRefPath = utils.prepareObjectPath(boundElement.objectPath)
                    boundElement.target = utils.returnTargetProperty(dataObjectProxy, oRefPath, true)
                    var splitPath = boundElement.objectPath.split(".")
                    boundElement.property = splitPath[(splitPath.length - 1)]
                    initializeTransmitter(boundElement, bindMode)
                    break

                case 'format':
                    // format binds have syntax "format: objectPath|callbackFunction"
                    [objectPath, callBackPath] = boundElement.objectPath.split('|')
                    try {
                        boundElement.updateCallback = utils.returnTargetProperty(dataObjectProxy, callBackPath)
                    }
                    catch (err) {
                        console.error(err.message)
                    }
                    boundElement.objectPath = objectPath
                case "value":

                    targetPath = utils.prepareObjectPath(boundElement.objectPath)
                    boundElement.target = utils.returnTargetProperty(dataObjectProxy, targetPath, true)
                    splitPath = boundElement.objectPath.split(".")
                    boundElement.property = splitPath[(splitPath.length - 1)]
                    receivers.push(boundElement)
                    boundElement.update()
                    break

                case "attr":
                    // attr bindings follow syntax "attr: targetAttr|binding"
                    [attr, binding, callBackPath] = boundElement.objectPath.split('|')
                    if (callBackPath) {
                        try {
                            boundElement.updateCallback = utils.returnTargetProperty(dataObjectProxy, callBackPath)
                        }
                        catch (err) {
                            console.error(err.message)
                        }
                    }

                    boundElement.objectPath = binding
                    splitPath = boundElement.objectPath.split(".")
                    boundElement.property = splitPath[(splitPath.length - 1)]
                    targetPath = utils.prepareObjectPath(boundElement.objectPath)
                    boundElement.target = utils.returnTargetProperty(dataObjectProxy, targetPath, true)
                    splitPath = boundElement.objectPath.split(".")
                    receivers.push(boundElement)
                    boundElement.attr = attr
                    boundElement.update()
                    break
                case "for":
                    initializeForeach(boundElement)
                    break
                case "hidden":
                    targetPath = utils.prepareObjectPath(boundElement.objectPath)
                    boundElement.target = utils.returnTargetProperty(dataObjectProxy, targetPath, true)
                    splitPath = boundElement.objectPath.split(".")
                    boundElement.property = splitPath[(splitPath.length - 1)]
                    receivers.push(boundElement)
                    boundElement.update = function () {
                        boundElement.DOMelement.hidden = boundElement.target[boundElement.property]
                    }
                    boundElement.update()
                    break

                case "visible":
                    targetPath = utils.prepareObjectPath(boundElement.objectPath)
                    boundElement.target = utils.returnTargetProperty(dataObjectProxy, targetPath, true)
                    splitPath = boundElement.objectPath.split(".")
                    boundElement.property = splitPath[(splitPath.length - 1)]

                    receivers.push(boundElement)
                    boundElement.update = function () {
                        boundElement.DOMelement.hidden = !boundElement.target[boundElement.property]
                    }
                    boundElement.update()
                    break
            }
        }
        return dataObjectProxy
    }
    isObservable(object: any) :  object is proxyObservable {
        if (typeof object._observableObject != 'undefined') {
            return true
        }
        return false
    }
}
    zk_self.subscribe = function(eventTypes, target, property, callback) {
        this.eventTypes = eventTypes
        this.target = target
        this.property = property
        this.callback = callback

        if (!(target instanceof zk_self.ObservableObject)) {
            throw new Error("Invalid subscription target. Subscribe must be called on an ObservableObject")
        }

        if (!target._subscribers) {
            target._subscribers = []
        }
        target._subscribers.push(this)
        this.applyCallbacks(eventType) = function() {
            if (!callback){return}

            if (eventTypes.includes(eventTypes)) {
                callback(eventType, target)
            }
                
        }

    }

    // 'on' binds have an object path of <event>|<callback>
    function registerListener(boundElement, model) {
        // Locate split end parentheses off
        let eventType, methodSignature
        [eventType, methodSignature] = boundElement.objectPath.split('|')
        let methodName = methodSignature.split('(')[0]
        let parameters = methodSignature.split('(')[1].split(')')[0]
        let argArray = []
        for (key of parameters.split(',')){
            argArray.push(model[key])
        }
        try {
            let callbackParent = utils.returnTargetProperty(model,methodName,true)
            
            let callback = utils.returnTargetProperty(model,methodName)
            if (!callback) {
                throw new Error('callback not found at ', methodSignature, 'in model: ', model)
            }
            boundElement.DOMelement.addEventListener(eventType, function(){callback.apply(callbackParent,argArray)})
        }
        catch (err) {
            console.error(`${err.name}: ${err.message}`)
        }
        
    }

    let utils = {
        deepClone : function deepClone(object) {
            
            if (Array.isArray(object)) {
                let newArray = []
                for (let item of object) {
                    cloneItem = deepClone(item)
                    newArray.push(cloneItem) 
            }
            let newObject = {}
            if (typeof object != "object") {
                return object}
            }
            for (let property in object) {
                newObject[property] = deepClone(object[property])
            }
            return newObject

        },
        deepProxy:  function deepProxy <type> (object: string | any[], handler: ProxyHandler<any>) : proxyObservable<type> {
            // do not remake observable objects
            if (typeof object == "function") {return new Proxy(object, handler)}
            if (Array.isArray(object)) {
                    

                for (let i = 0; i < object.length; i++) {
                    object[i] = deepProxy(object[i], handler)
                }
                object = new Proxy(object, handler)
                return object
            }
            for (let item in object) {
                if (typeof object[item] == "object"){
                    object[item] = deepProxy(object[item], handler)
                }
            }

            if ((typeof object == "object") && object)  {
                return new Proxy(object, handler)

            }
            return object
        },
        // method to remove first and last object for oRef attribut
        prepareObjectPath: function (objectPath) {
            let objArray = objectPath.split(".")
            let property = objArray[(objArray.length-1)]
            objArray = objArray.splice(1)
            objArray = objArray.join(".")
            return objArray

        },
        // generalizing the method to access object property using string path such as "person.task.dueDate"
        returnTargetProperty: function returnTargetProperty(objectTarget: any, pathToObject: string, getParent? : any) {
            let targetChild = objectTarget
            let splitPath = pathToObject.split('.')
            
            let i = 0
            if (splitPath[0]=="root")  {
                targetChild = zk_self.root_model
                i++
             }
            
            while (i < splitPath.length) {
                
                if  (getParent && (i == (splitPath.length - 1))) {return targetChild}
                targetChild = targetChild[splitPath[i]]
                if (!targetChild) {
                    throw new Error(pathToObject + " is an invalid property path")
                }
                i++
            }
            
            
            return targetChild
        },
        
        
    }




