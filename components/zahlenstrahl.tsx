import * as React from 'react';
import * as d3 from "d3";
import cookieCutter from 'cookie-cutter';
import { rgb } from 'd3';
import dataHandler from './dataHandler';


let a;
let topBorder ;
let bottomBorder ;
let aGefunden = false;
let includingBottom = false;
let includingTop = false;
let includingGaps = false;
let gaps ;//
gaps= [] ;

// async function LoadData(){

//         // let data = getCookie("MyCookie");
//          const data = cookieCutter.get('MyCookie');
//          let dataTable = {
//             table: []
//         };
//         if(data!=='{}'){
//             dataTable = JSON.parse(data); 
//             return dataTable;
//         }else{
//             console.log("Keine Daten vorhanden");
//             return 0;
//         }
// }

async function processDataTable(){
    const data = cookieCutter.get('MyCookie');
    let dataTable = {
        table: []
    };    
    if(data!=='{}'){
        dataTable = JSON.parse(data); 
    }else{
        console.log("Keine Daten vorhanden");
        return 0;
    }
    let localTable = dataTable;
    var length = localTable.table.length;
    let loopcount =0;
    topBorder = 'max';
    bottomBorder = 'min';
    //In bottomBorder muss der größte Wert eingetragen werden, der kleiner als a ist
    //In topBorder muss der kleinste Wert eingetragen werden, der größer als a ist
    for(let i = 0;i < length; i++){
        loopcount++;
        var content ;
        content = localTable.table.pop();
        if(typeof content ==='undefined'){
            alert("Can't load element from table!")
        }else{
            // console.log("a " + content.op + content.val);
            let value;
            value = parseInt(content.val,10)
            switch (content.op) {
            case '<':
                //Wenn in topBorder 'min' steht, oder der gegenwärtige Wert kleiner, 
                //als der bisher größte eingetragene Wert ist wird der gegenwärtige Wert
                //in topBorder notiert und die Inklusion abgeschaltet
                if(typeof topBorder!=='number' || topBorder>value){
                    topBorder = value;
                    includingTop = false;
                }
                break;
            case '>':
                //Wenn in Bottomborder 'min' steht, oder der gegenwärtige Wert größer, 
                //als der bisher größte eingetragene Wert ist wird der gegenwärtige Wert
                //in BottomBorder notiert und die Inklusion abgeschaltet
                if(typeof bottomBorder!=='number' || bottomBorder<value){
                    bottomBorder = value;
                    includingBottom = false;
                }
                break;
            case '≥':
                //Wenn in Bottomborder 'min' steht, oder der gegenwärtige Wert größer, 
                //als der bisher größte eingetragene Wert ist wird der gegenwärtige Wert
                //in BottomBorder notiert und die Inklusion eingeschaltet, da a auch den Wert annehmen kann
                if(typeof bottomBorder!=='number' || bottomBorder<value){
                    bottomBorder = value;
                    includingBottom = true;
                }
                break;
            case '≤':
                //Wenn in topBorder 'min' steht, oder der gegenwärtige Wert kleiner, 
                //als der bisher größte eingetragene Wert ist wird der gegenwärtige Wert
                //in topBorder notiert und die Inklusion eingeschaltet, da a auch den Wert annehmen kann.
                if(typeof topBorder!=='number' || topBorder>value){
                    topBorder = value;
                    includingTop = true;
                }
                
                break;
            case '=':
                a=value;
                aGefunden=true;
                break;
            case '!=':
                gaps.push(value)
                includingGaps=true;
                break;
        
            default:
                break;
            }
        }
    }
    console.log("Top Border: " + topBorder + " including: " + includingTop )
    console.log("Bot Border: " + bottomBorder + " including: " + includingBottom)
    console.log("a: " + a + " gefunden: " + aGefunden)
    console.log("gaps: " + gaps + " including: " + includingGaps)
}

async function drawSvg(svgRef: React.RefObject<SVGSVGElement>) {
    let h = 60;
    let w = 600;
    const achsenHöhe = h-20;
    const breitederbalken = 0;
    const svg = d3.select(svgRef.current);
    let data;// = [];
    data = [];
    let bot ;
    let top ;
    if(typeof topBorder === 'number'){
        data.push(topBorder);
        top=topBorder;
    }
    if(typeof bottomBorder === 'number'){
        data.push(bottomBorder);
        bot=bottomBorder;
    }
    const lineDistance =top-bot;
    // top=top-breitederbalken;
  
  https://github.com/jeremyholcombe/d3-interactive-number-line/blob/master/number-line.js

  svg
    .attr("width", w)
    .attr("height", h)
    .style("margin-top", 50)
    .style("margin-bottom", 50)
    .style("margin-left", 50)
    .style("margin-right", 50)
    .style("background-color",rgb(196, 196, 196));
let obenoffen = true;
let untenoffen = true;
console.log("top " + topBorder);
console.log("bot " + bottomBorder);
for (let index = 0; index < 2; index++) {

    if (!isNaN(bottomBorder)) {
        untenoffen = false;
        console.log("unten geschlossen");
    }else{
        if (!obenoffen) {
            bot=topBorder-5; 
            data.push(bot);   
        }
    }
    if (!isNaN(topBorder)) {
        obenoffen = false;
        console.log("oben geschlossen");
    }else{
        if (!untenoffen) {
            top=bottomBorder+5; 
            data.push(top); 
            console.log(data +" " + data.length );
        }
    }
    
}


    if(!isNaN(bot) && !isNaN(top)){



    let data2;
    data2 = [];

    data.sort(function(a, b) {
        return a + b;
    });
    console.log(data +" " + data.length );
    gaps.sort(function(a, b) {
        return a - b;
    });
    console.log(gaps +" " + gaps.length );
    let gapsLänge = gaps.length;
    let daten_false_order;
    daten_false_order = [];
    //Lücken müssen ins array mit eingefügt werden
    daten_false_order.push(data.pop());
    for (let index = 0; index < gapsLänge; index++) {
        if(gaps[index]>bot &&gaps[index]<top){
            daten_false_order.push(gaps[index]);
        }
    }
    daten_false_order.push(data.pop());
    let länge;

    let daten;
    daten = [];
    let datenlänge = daten_false_order.length;
    for (let index = 0; index < datenlänge; index++) {
        daten.push(daten_false_order.pop());
        
    }

    if(includingGaps){
        länge = daten.length/2;
    }else{
        länge=daten.length-1;
    }










    console.log("daten: "+ daten);
    console.log("länge: "+ länge);
    for (let index = 0; index < länge; index++) {    
        
        data2.push(daten.pop())
        let differenzStartEnde = Math.abs(top-bot);
        let startskaliert= 25+(data2[0]-bot)*((w/(differenzStartEnde)));
        if (obenoffen) {
            startskaliert /=startskaliert;
        } 
        let endeskaliert = (daten[daten.length-1]-bot)*((w/(differenzStartEnde)))-25;
        let differenzStartEndelokal = Math.abs(endeskaliert - startskaliert);
        let stepskaliert = (differenzStartEndelokal)/(differenzStartEnde);

        if (obenoffen) {
            endeskaliert = w;
        }
        if (untenoffen) {
            startskaliert = 0;
        }



        if(index===0 || index ===länge-2){
            if(!includingTop&&!obenoffen){
                endeskaliert -= stepskaliert/2;
                console.log("oben nicht eingeschlossen")
            }
            if(!includingBottom&&!untenoffen){
                startskaliert += stepskaliert/2;
                console.log("unten nicht eingeschlossen")
            }
        }else{
            if(!obenoffen&&!untenoffen){
                endeskaliert -= stepskaliert/2;
                startskaliert += stepskaliert/2;
                console.log("überall geschlossen und Mittelteil")
            }
        }


        let breiteSkaliert = Math.sqrt((endeskaliert - startskaliert)*(endeskaliert - startskaliert))
        
        console.log("daten: "+ daten);
        console.log("data2: "+ data2);
        console.log("w: "+ w);
        console.log("differenzStartEnde: "+ differenzStartEnde);
        console.log("differenzStartEndelokal: "+ differenzStartEndelokal);
        console.log("startskaliert: "+ startskaliert);
        console.log("endeskaliert: "+ endeskaliert);
        console.log("breiteSkaliert: "+ breiteSkaliert);
        console.log("stepskaliert: "+ stepskaliert);

        svg.selectAll("rect"+länge)
            .data(daten)
            .enter()
            .append("rect")
            .attr("x", startskaliert)//(d, i) => 25+(d-bot)*((w/(top-bot))-breitederbalken))
            .attr("y", 2)
            .attr("width", breiteSkaliert)
            .attr("height", 48)
            .attr("opacity", 50)
            .attr("fill", rgb(79, 189, 83));
            if(!untenoffen){
            svg.append('path')
                .attr('d', d3.line()([[startskaliert+10,2], [startskaliert, 2], [startskaliert, 50], [startskaliert+10, 50]]))
                .attr('stroke', rgb(18, 128, 6))
                .attr('stroke-width', 4)
                .attr('fill', 'none');
            }
            if(!obenoffen){
                svg.append('path')
                .attr('d', d3.line()([[endeskaliert-10,2], [endeskaliert, 2], [endeskaliert, 50], [endeskaliert-10, 50]]))
                .attr('stroke', rgb(18, 128, 6))
                .attr('stroke-width', 4)
                .attr('fill', 'none');
            }
                

        daten.pop();
        data2.pop();
    }

        var x = d3.scaleLinear()
        .domain([bot, top])
        .range([25, w-25]);
        let xAxisGenerator = d3.axisBottom(x)
        let tick = top-bot;
        if(tick>10){
            tick=10;
        }
        if(obenoffen){
            tick=2;
            let tickLabels = [bot,'∞'];
            xAxisGenerator.tickFormat((d,i) => tickLabels[i]);
            xAxisGenerator.tickValues([bot,top]);
        }else if (untenoffen) {
            tick=2;
            let tickLabels = ['∞',top];
            xAxisGenerator.tickFormat((d,i) => tickLabels[i]);
            xAxisGenerator.tickValues([bot,top]);
            
        }
        xAxisGenerator.ticks(tick);
        xAxisGenerator.tickSize(-5);

        let xAxis =svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0,"+achsenHöhe+")")
            .call(xAxisGenerator);

        xAxis.selectAll(".tick text")
            .attr("font-size","20")
            .attr("color","red")

        svg.append('defs')
            .append('marker')
            .attr('id', 'arrow')
            .attr('viewBox', [0, 0, w, h])
            .attr('refX', 10)
            .attr('refY', 10)
            .attr('markerWidth', w)
            .attr('markerHeight', h)
            .attr('orient', 'auto-start-reverse')
            .append('path')
            .attr('d', d3.line()([[0, 7], [0, 13], [15, 10]]))
            .attr('stroke', 'black');
        svg.append('path')
            .attr('d', d3.line()([[w-5, achsenHöhe], [5, achsenHöhe]]))
            .attr('stroke', 'black')
            .attr('marker-start', 'url(#arrow)')
            .attr('marker-end', 'url(#arrow)')
            .attr('fill', 'none');
        }
}

const Zahlenstrahl: React.FunctionComponent = () => {
  const svg = React.useRef<SVGSVGElement>(null);
  processDataTable();
  React.useEffect(() => {
    drawSvg(svg);
  }, [svg]);

  return (
    <div id="Zahlenstrahl">
      <svg ref={svg} />
    </div>
  );
};

export default Zahlenstrahl;