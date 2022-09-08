import cookieCutter from 'cookie-cutter';

let Cookiename;

function CookiePrinter(name) {
 var table = print(name);
 return table;
}
export default CookiePrinter;

async function print(Cookiename){
    console.log("Ausgabe von Cookie: " + Cookiename);
    let data ;
    data = cookieCutter.get(Cookiename);
        let obj = {
            table: []
        };
        if(data!=='{}'&&typeof data!=='undefined'){
            obj = JSON.parse(data); 
        }else{
            console.log("Keine Daten eingegeben");
            return 0;
        }
        console.log("Anzahl der einträge: " + obj.table.length);
        var length = obj.table.length
        for(let i = 0;i < length; i++){
            var content = obj.table.pop();
            console.log( "a " + content.op + " " + content.val );
        }
    return 0;
}