import Layout from '../components/layout';
import cookieCutter from 'cookie-cutter';

let Cookiename;

function CookiePrinter(name) {
    Cookiename = name;
 var table = print();
 return table;
//  return(
//     <Layout print>    </Layout>
//    )
}

export function CookieHtml(){
   return(
    <Layout>
      <div>{print}</div>
    </Layout>
   )
}
export default CookiePrinter;

async function print(){
    console.log(Cookiename);
    let data = cookieCutter.get(Cookiename);
        let obj = {
            table: []
        };
        if(data!=='{}'){
            obj = JSON.parse(data); 
        }else{
            console.log("Keine Daten eingegeben");
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
            console.log( "a " + content.op + " " + content.val );
        }
        k+='</tbody>';
        // console.log(k);
    return ( 
         k
     );
}