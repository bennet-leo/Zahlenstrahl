import cookieCutter from 'cookie-cutter';

async function addToCookie (operator, value, Cookiename){
    
    let data = cookieCutter.get(Cookiename)
    let obj = {
        table: []
     };
        try {
            if(data!=='{}'){
                obj = JSON.parse(data); 
                obj.table.push({op: operator, val : value});
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
}

async function deleteCookie(name){
    cookieCutter.set(name, '{}',);
    printCookieContent("Daten gelöscht")
}

async function printCookieContent(string){
    let data = cookieCutter.get(Cookiename)
    console.log("Cookie message: "+string+": " + data);
}

function dataHandler(operator,value,name) {
    if(operator==="delete"){
        deleteCookie(name);
    }else{
        addToCookie(operator , value, name)
    }
    console.log(name)
    return ( 0);

}

export default dataHandler;


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