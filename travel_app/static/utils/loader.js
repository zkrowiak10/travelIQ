

async function GetModules() {
    console.log("Loading modules")

    let tabContentTemplate = await fetch('/static/utils/tabContent.html', { headers: {"Content-Type" : "text/html"}})
     
     tabContentTemplate = await tabContentTemplate.text()

    let modalTemplate = await fetch('/static/utils/modal.html', { headers: {"Content-Type" : "text/html"}})
    
    modalTemplate = await modalTemplate.text()
    
    res = {}

    res.tabContentTemplate = tabContentTemplate

    res.modalTemplate = modalTemplate

    return res
}