export {logging, formatDate}
import {zk} from '../../lib/zk.js'
function logging(...args) {
    console.log(...args)
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

export function formatDatePretty(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + (d.getDate() + 1),
        year = d.getFullYear();
        

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [ month, day,year].join('/');
}

export function formatPrice(price) {
    price = Number.parseFloat(price)
    if (!price){
        return "No data"
    }
    let str = "$" + price.toFixed(2)
    return str
}
export const g = zk.makeObservable({
    trip: {
        name : "",
        isDefined: false,
        id: undefined
    } 
})
