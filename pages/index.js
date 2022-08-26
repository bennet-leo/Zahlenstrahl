import Head from 'next/head'
import styles from '../styles/Home.module.css'
import dataHandler from '../components/dataHandler'
import CookiePrinter from '../components/cookiePrinter'
import Zahlenstrahl from '../components/zahlenstrahl.tsx'
import { setCookieName } from '../components/zahlenstrahl.tsx'

const Zahlenstrahl_1_name = "0001";
export default function Home() {

  return (
    <div className={styles.container}>
      <Head>
        <title>Zahlenstrahl</title>
      </Head>
      <main className={styles.main}>
          <Zahlenstrahl  {...setCookieName(Zahlenstrahl_1_name)} />
          <div>Definitionsbereich von a</div>
          <div>
            <label>a </label>
          <select id = "operator">
            <option defaultValue>&#62;</option>
            <option>&#8805;</option>
            <option>&#60;</option>
            <option>&#8804;</option>
            <option>=</option>
            <option>!=</option>
          </select>
          <input type="text" id="value" onClick={clear} />
          </div>
          <div>
            <button onClick={dataToJson(Zahlenstrahl_1_name)} >hinzufügen</button>
            <button onClick={reset} >reset</button>
            <button onClick={showData} >Daten Anzeigen</button>
            <button onClick={Vis} >Visualiserung Anzeigen</button>         
      </div>
      </main>
    </div>    
  )
}

function showData(Cookiname){
  var text = CookiePrinter(Cookiname);
  // var elem = document.getElementById("cookie");
  // elem.text = text;
}

 function clear(){
  const inputField = document.getElementById("value");
  inputField.value = "";
 }

 function dataToJson(CookieName) {
   let operator = document.getElementById("operator").value;
   let value = document.getElementById("value").value;
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
 function reset(){
   dataHandler('delete', 0);
   location.reload();
 }
