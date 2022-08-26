import cookieCutter from 'cookie-cutter';

let Cookiename;

async function addToCookie (operator, value){
    
    let data = cookieCutter.get(Cookiename)
    let obj = {
        table: []
     };
        try {
            if(data!=='{}'){
                obj = JSON.parse(data); 
                obj.table.push({op: operator, val : value});
                // console.log("read data from cookie and added new entry");
            }else{
                obj = {
                    table: [{op: operator, val:value}]
                };
            }

        } catch (error) {
            console.log(error);
        }

    let json = JSON.stringify(obj) ;

     cookieCutter.set(Cookiename, json)
    //  printCookieContent("Daten hinzugefügt")
}

async function deleteCookie(){
    cookieCutter.set(Cookiename, '{}',);
    printCookieContent("Daten gelöscht")
}

async function printCookieContent(string){
    let data = cookieCutter.get(Cookiename)
    console.log("Cookie message: "+string+": " + data);
}

function dataHandler(operator,value,name) {
    if(operator==="delete"){
        deleteCookie();
    }else{
        Cookiename = name;
        addToCookie(operator , value)
    }
    console.log(Cookiename)
    return ( 0);

}

export default dataHandler;

// export async function dataToJson2(operator, value, CookieName) {
//     let operator = document.getElementById("operator").value;
//     let value = document.getElementById("value").value;
//      if( !isNaN(value) && value.length !== 0 ){ //
//        let text = dataHandler(operator, value,CookieName);
//     }else{
//      alert("Bitte eine Zahl eingeben.")
//      clear();
//      }
//     }


async function print(value){
    let data2 = cookieCutter.get(Cookiename);
        let obj = {
            table: []
        };
        if(data2!=='{}'){
            obj = JSON.parse(data2); 
            obj.table.push({op: operator, val : value});
            console.log("read data2 from cookie and transformed into table");
        }else{
            return 0;
        }
        var k = '<tbody>'
        for(i = 0;i < obj.length; i++){
            k+= '<tr>';
            k+= '<td>' + obj[i].operator + '</td>';
            k+= '<td>' + obj[i].value + '</td>';
            k+= '</tr>';
        }
        k+='</tbody>';
    return ( 
         k
     );
}