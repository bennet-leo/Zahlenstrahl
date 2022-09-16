import Head from 'next/head'
import styles from '../styles/Home.module.css'
import dataHandler from '../components/dataHandler'
import CookiePrinter from '../components/cookiePrinter'
import Zahlenstrahl from '../components/zahlenstrahl.tsx'
import {drawSvg} from '../components/zahlenstrahl.tsx'
import { setCookieName } from '../components/zahlenstrahl.tsx'
import Zlstrl from '../components/zahlenstrahl_module'

const Zahlenstrahl_1_name = "0001";
const Zahlenstrahl_2_name = "0002";
export default function Home() {

  return (
    <div className={styles.container}>
      <Head>
        <title>Zahlenstrahl</title>
      </Head>
      <main className={styles.main}>
          <div><Zahlenstrahl name={Zahlenstrahl_1_name} /></div>
          <div>Definitionsbereich von a</div>
          <div>
            <label>a </label>
            <select id = {"operator"+Zahlenstrahl_1_name}>
              <option defaultValue>&#62;</option>
              <option>&#8805;</option>
              <option>&#60;</option>
              <option>&#8804;</option>
              <option>=</option>
              <option>!=</option>
            </select>
            <input type="text" id={"value"+Zahlenstrahl_1_name}onClick={() => clear(Zahlenstrahl_1_name)} />
          </div>
          <div>
            <button onClick={() => dataToCookie(Zahlenstrahl_1_name)} >Hinzufügen</button>
            <button onClick={() => CookiePrinter(Zahlenstrahl_1_name)} >Daten anzeigen</button>     
          </div>


            {/* <Zahlenstrahl name={Zahlenstrahl_2_name} />
            <div>Definitionsbereich von a</div>
          <div>
            <label>a </label>
            <select id = {"operator"+Zahlenstrahl_2_name}>
              <option defaultValue>&#62;</option>
              <option>&#8805;</option>
              <option>&#60;</option>
              <option>&#8804;</option>
              <option>=</option>
              <option>!=</option>
            </select>
            <input type="text" id={"value"+Zahlenstrahl_2_name}onClick={() => clear(Zahlenstrahl_2_name)} />
          </div>
          <div>
            <button onClick={() => dataToCookie(Zahlenstrahl_2_name)} >hinzufügen</button>
            <button onClick={() => CookiePrinter(Zahlenstrahl_2_name)} >Daten Anzeigen</button>   
          </div> */}
      </main>
    </div>   
    
  )
}


 function clear(name){
  const inputField = document.getElementById("value"+name);
  inputField.value = "";
 }

 async function dataToCookie(CookieName) {
   let operator = document.getElementById("operator"+CookieName).value;
   let value = document.getElementById("value"+CookieName).value;
    if( !isNaN(value) && value.length !== 0 ){ //
      let text = dataHandler(operator, value,CookieName);
   }else{
    alert("Bitte eine Zahl eingeben.")
    clear();
    }
 }
