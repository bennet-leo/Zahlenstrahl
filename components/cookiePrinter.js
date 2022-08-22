import cookieCutter from 'cookie-cutter';

function CookiePrinter() {
 var table = print();
 return table;
}

export function CookieHtml(){
   return(
            print()
   )
}


export default CookiePrinter;

async function print(){
    let data = cookieCutter.get('MyCookie');
        let obj = {
            table: []
        };
        if(data!=='{}'){
            obj = JSON.parse(data); 
        }else{
            console.log("Cookie Anzeige abgebrochen");
            return 0;
        }
        console.log("Anzahl der einträge: " + obj.table.length);
        var k ='<tbody>'
        var length = obj.table.length
        for(let i = 0;i < length; i++){
            var content = obj.table.pop();
            k+= '<tr>';
            k+= '<td>' + content.op + '</td>';
            k+= '<td>' + content.val + '</td>';
            k+= '</tr>';
            console.log( "a " + content.op + ":" + content.val );
        }
        k+='</tbody>';
        // console.log(k);
    return ( 
         k
     );
}