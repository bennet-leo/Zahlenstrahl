import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Chart from '../components/chart.tsx'
import dataHandler from '../components/dataHandler'
import CookiePrinter from '../components/cookiePrinter'
import Zahlenstrahl from '../components/zahlenstrahl.tsx'


export default function Home() {

  return (
    <div className={styles.container}>
      <Head>
        <title>Zahlenstrahl</title>
      </Head>
      <main className={styles.main}>
          <Zahlenstrahl />
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
            <button onClick={dataToJson} >hinzufügen</button>
            <button onClick={reset} >reset</button>
          </div>
          <div>
            <button onClick={showData} >Daten Anzeigen</button>
            </div>
          <div>
            <button onClick={Vis} >Visualiserung Anzeigen</button>
            </div>           
      </main>
    </div>    
  )
}

function showData(){
  var text = CookiePrinter();
  // var elem = document.getElementById("cookie");
  // elem.text = text;
}

 function clear(){
  const inputField = document.getElementById("value");
  inputField.value = "";
 }

 function dataToJson() {
   let operator = document.getElementById("operator").value;
   let value = document.getElementById("value").value;
    if( !isNaN(value) && value.length !== 0 ){ //
    dataHandler(operator, value);
   }else{
    alert("Bitte eine Zahl eingeben.")
    clear();
    }

  //  if(!isNaN(value)&& value.length !== 0){
  //   dataHandler(operator, value);
  //  }else{
  //   alert("Bitte eine Zahl eingeben.")
  //   clear();
  //  }

   location.reload();
   showData();
 }
 function Vis(){
  location.reload();
 }
 function reset(){
   dataHandler('delete', 0);
   location.reload();
 }
