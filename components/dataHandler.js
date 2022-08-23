import cookieCutter from 'cookie-cutter';

async function addToCookie (operator, value){
    
    let data = cookieCutter.get('MyCookie')
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

     cookieCutter.set('MyCookie', json)
    //  printCookieContent("Daten hinzugefügt")
}

async function deleteCookie(){
    cookieCutter.set('MyCookie', '{}',);
    printCookieContent("Daten gelöscht")
}

async function printCookieContent(string){
    let data = cookieCutter.get('MyCookie')
    console.log("Cookie message: "+string+": " + data);
}

function dataHandler(operator,value) {
    if(operator==="delete"){
        deleteCookie();
    }else{
        addToCookie(operator , value)
    }
    return ( 0);
}

export default dataHandler;

async function print(value){
    let data2 = cookieCutter.get('MyCookie');
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