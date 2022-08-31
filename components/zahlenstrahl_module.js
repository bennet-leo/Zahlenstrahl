import dataHandler from '../components/dataHandler'
import CookiePrinter from '../components/cookiePrinter'
import Zahlenstrahl from '../components/zahlenstrahl.tsx'

let Zahlenstrahl_name = "0001";

function zlstrl(name) {
    Zahlenstrahl_name=name;
    return ( 
        <div>
          <div>
            {/* <div id={Zahlenstrahl_2_name}></div> */}
            <div><Zahlenstrahl name={Zahlenstrahl_name} /></div>
            <div>Definitionsbereich von a</div>
          </div>
          <div>
            <label>a </label>
            <select id = {"operator"+Zahlenstrahl_name}>
              <option defaultValue>&#62;</option>
              <option>&#8805;</option>
              <option>&#60;</option>
              <option>&#8804;</option>
              <option>=</option>
              <option>!=</option>
            </select>
            <input type="text" id={"value"+Zahlenstrahl_name}onClick={() => clear(Zahlenstrahl_name)} />
          </div>
          <div>
            <button onClick={() => dataToJson(Zahlenstrahl_name)} >hinzufügen</button>
            <button onClick={() => reset(Zahlenstrahl_name)} >reset</button>
            <button onClick={() => showData(Zahlenstrahl_name)} >Daten Anzeigen</button>
            <button onClick={() => Vis(Zahlenstrahl_name)} >Visualiserung Anzeigen</button>     
          </div>
      </div>
     );
}

export default zlstrl;

function showData(Cookiname){
    var text = CookiePrinter(Cookiname);
    // var elem = document.getElementById("cookie");
    // elem.text = text;
  }
  
   function clear(name){
    const inputField = document.getElementById("value"+name);
    inputField.value = "";
   }
  
   async function dataToJson(CookieName) {
     let operator = document.getElementById("operator"+CookieName).value;
     let value = document.getElementById("value"+CookieName).value;
      if( !isNaN(value) && value.length !== 0 ){ //
        let text = dataHandler(operator, value,CookieName);
     }else{
      alert("Bitte eine Zahl eingeben.")
      clear();
      }
   }
   function Vis(){
    location.reload();
   }
   function reset(CookieName){
     dataHandler('delete', 0, CookieName);
     location.reload();
   }