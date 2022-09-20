import * as React from 'react';
import * as d3 from "d3";
import cookieCutter from 'cookie-cutter';
import dataHandler from './dataHandler';


async function processDataTable(Cookiename){

    //Hier werden die Werte, die aus dem Cookie gelesen werden, abgespeichert
    const   processedInputValues = {};

    processedInputValues['topBorder']='undefined';
    processedInputValues['bottomBorder']='undefined';
    processedInputValues['isIncludingBottom']=false;
    processedInputValues['isIncludingTop']=false;
    processedInputValues['isIncludingGaps']=false;
    processedInputValues['gaps']=[];

    let data;
    //Daten werden aus einem Cookie geladen
    var cookie = cookieCutter;
    data = cookie.get(Cookiename);
    //Wenn initial geladen wird, muss der Cookie erst gesetzt werden.
    if (typeof data==='undefined') {
        // Cookiename='MyCookie';
    cookie.set(Cookiename, '{}',);
    data = cookie.get(Cookiename);
    }else{
        // return 0;
    }
    let dataTable;
    dataTable = {
        table: []
    };    
    if(data!=='{}'&&typeof Cookiename!=='undefined'){
        dataTable = JSON.parse(data); 
    }else{
        return 0;
    }
    let localTable = dataTable;
    var length = localTable.table.length;
    let loopcount =0;
    processedInputValues['topBorder'] = 'max';
    processedInputValues['bottomBorder'] = 'min';
    //In bottomBorder muss der größte Wert eingetragen werden, der kleiner als a ist
    //In topBorder muss der kleinste Wert eingetragen werden, der größer als a ist
    for(let i = 0;i < length; i++){
        loopcount++;
        var rawInputValues ;
        rawInputValues = localTable.table.pop();
        if(typeof rawInputValues ==='undefined'){
            alert("Can't load element from table!")
        }else{
            let value;
            value = parseInt(rawInputValues.val,10)
            let rawData;
            rawData = rawInputValues.val;
            switch (rawInputValues.op) {
            case '<':
                //Wenn in topBorder 'min' steht, oder der gegenwärtige Wert kleiner, 
                //als der bisher größte eingetragene Wert ist wird der gegenwärtige Wert
                //in topBorder notiert und die Inklusion abgeschaltet
                if(typeof processedInputValues['topBorder']!=='number' || processedInputValues['topBorder']>value){
                    processedInputValues['topBorder'] = value;
                    processedInputValues['isIncludingTop'] = false;
                }
                break;
            case '>':
                //Wenn in Bottomborder 'min' steht, oder der gegenwärtige Wert größer, 
                //als der bisher größte eingetragene Wert ist wird der gegenwärtige Wert
                //in BottomBorder notiert und die Inklusion abgeschaltet
                if(typeof processedInputValues['bottomBorder']!=='number' || processedInputValues['bottomBorder']<value){
                    processedInputValues['bottomBorder'] = value;
                    processedInputValues['isIncludingBottom'] = false;
                }
                break;
            case '≥':
                //Wenn in Bottomborder 'min' steht, oder der gegenwärtige Wert größer, 
                //als der bisher größte eingetragene Wert ist wird der gegenwärtige Wert
                //in BottomBorder notiert und die Inklusion eingeschaltet, da a auch den Wert annehmen kann
                if(typeof processedInputValues['bottomBorder']!=='number' || processedInputValues['bottomBorder']<value){
                    processedInputValues['bottomBorder'] = value;
                    processedInputValues['isIncludingBottom'] = true;
                }
                break;
            case '≤':
                //Wenn in topBorder 'min' steht, oder der gegenwärtige Wert kleiner, 
                //als der bisher größte eingetragene Wert ist wird der gegenwärtige Wert
                //in topBorder notiert und die Inklusion eingeschaltet, da a auch den Wert annehmen kann.
                if(typeof processedInputValues['topBorder']!=='number' || processedInputValues['topBorder']>value){
                    processedInputValues['topBorder'] = value;
                    processedInputValues['isIncludingTop'] = true;
                }
                
                break;
            case '=':
                //Wenn a direkt eingegeben wird, wird versucht ein Intervall mit den Grenzen a+1 und a-1 anzulegen
                //Da in der Visualisierung für kleinergleich und größergleich nur ein strich dargestellt werden würde.
                processedInputValues['a'];
            if(typeof processedInputValues['topBorder']!=='number' || processedInputValues['topBorder']>value){
                processedInputValues['topBorder'] = value + 1;
                processedInputValues['isIncludingTop'] = false;
            }
            if(typeof processedInputValues['bottomBorder']!=='number' || processedInputValues['bottomBorder']<value){
                processedInputValues['bottomBorder']  = (value - 1) as unknown as string;
                processedInputValues['isIncludingBottom'] = false;
            }
                break;
            case '!=':
                //Für werte, die aus dem Gültigkeitsbereich ausgeschlossen werden sollen, 
                //Wird eine Liste angelegt, in der sie vermerkt werden
                processedInputValues['gaps'].push(value)
                processedInputValues['isIncludingGaps']=true;
                break;
        
            default:
                break;
            }
        }
    }
    if(processedInputValues['bottomBorder']>processedInputValues['topBorder']){
        processedInputValues['nichtDefiniert'] = true;
    }
    // console.log(processedInputValues)
  return processedInputValues;
}

async function drawSvg(svgRef: React.RefObject<SVGSVGElement>,name) {

            let processedInputValues;
            processedInputValues ={
                topBorder :0,
                bottomBorder :0,
                isIncludingBottom : false,
                isIncludingTop : false,
                isIncludingGaps : false,
                gaps : []
            } 
            //Hier werden die Werte für die Visualisierung abgespeichert
            let visualisationData;
            visualisationData = {
                visualTopBorder :undefined,
                visualBottomBorder :undefined,
                blockMap : new Map()
            };

            const   inputData = processDataTable(name);
            processedInputValues = await inputData.then();

            // let isIncludingBottom  = processedInputValues.isIncludingBottom;
            // let isIncludingTop  = processedInputValues.isIncludingTop;
            let isIncludingGaps  = processedInputValues.isIncludingGaps;
            let gaps = processedInputValues.gaps;


            const h = 60;
            const w = 300;
            const green =       '#4fbd53';
            const dark_green =  '#128006';
            const gray =        '#b5b5b5';
            const achsenHöhe = h-20;
            const svg = d3.select(svgRef.current);
            const offsetLeft = 25;
            const offsetRight = 25;

            let data;
            data = [];

            if(typeof processedInputValues.topBorder === 'number'){
                data.push(processedInputValues.topBorder);
                visualisationData.visualTopBorder=processedInputValues.topBorder;
            }
            if(typeof processedInputValues.bottomBorder === 'number'){
                data.push(processedInputValues.bottomBorder);
                visualisationData.visualBottomBorder=processedInputValues.bottomBorder;
            }

          svg
            .attr("width", w)
            .attr("height", h)
            .style("margin-top", 50)
            .style("margin-bottom", 5)
            .style("margin-left", 50)
            .style("margin-right", 50)
            .style("background-color",gray)
            .text('no');
        
        //Bei oben oder unten unbegrenzten Intervallen muss eine künstliche Grenze
        //vergeben werden. um das Anzeigen zu ermöglichen
        //dazu wird der oberste oder unterste letzte darzustellende Parameter ausgewählt und 
        //im Abstand von 5 dazu die künstliche Grenze gesetzt.
        //Ist keine Grenze oben UND unten vorhanden. muss die Vergabe der künstlichen Grenze
        //doppelt durchgeführt werden, damit oben und unten eine künstliche Grenze eingefügt wird
        let isTopInfinite = true, isBottomInfinite = true;

        let isAartificialTopBorderSet = false, isArtificialBottomBorderSet = false;
        for (let index = 0; index < 2; index++) {
        
            if (!isNaN(processedInputValues.bottomBorder)) {
                isBottomInfinite = false;
            }else{
                if (!isTopInfinite&&!isArtificialBottomBorderSet) {
                    if (isIncludingGaps) {
                        const min = Math.min(...gaps);
                        visualisationData.visualBottomBorder=min-5; 
                    }else{
                        visualisationData.visualBottomBorder=processedInputValues.topBorder-5; 
                    } 
                    data.push(visualisationData.visualBottomBorder);   
                    isArtificialBottomBorderSet=true;
                }
            }
            if (!isNaN(processedInputValues.topBorder)) {
                isTopInfinite = false;
            }else{
                if (!isBottomInfinite&&!isAartificialTopBorderSet) {
                    if (isIncludingGaps) {
                        const max = Math.max(...gaps);
                        visualisationData.visualTopBorder=max+5;
                    }else{
                        visualisationData.visualTopBorder=processedInputValues.bottomBorder+5;
                    } 
                    data.push(visualisationData.visualTopBorder); 
                    isAartificialTopBorderSet=true;
                }
            }
            
        }
        //Inhalte der Grafik werden erst generiert, wenn mindestens ein Wert vergeben wurde
        //Ansonsten wird nur der Hintergrund angezeigt
            // console.log("processedInputValues.topBorder " + visualisationData.visualTopBorder)
            if(!isNaN(visualisationData.visualBottomBorder) && !isNaN(visualisationData.visualTopBorder)){
        
            data.sort(function(a, b) {
                return a + b;
            });
            gaps.sort(function(a, b) {
                return a - b;
            });
            let gapsLänge = gaps.length;

            let daten;
            daten = [];
            //Lücken müssen ins array mit eingefügt werden
            daten.push(data.pop());
            for (let index = 0; index < gapsLänge; index++) {
                if(gaps[index]>visualisationData.visualBottomBorder &&gaps[index]<visualisationData.visualTopBorder){
                    //Werte für Lücken müssen doppelt eingefügt werden,
                    //da sie die Grenzen von zwei Blöcken darstellen
                    daten.push(gaps[index]);
                    daten.push(gaps[index]);
                }
            }
            daten.push(data.pop());
            let länge;

            daten.sort(function(a, b){return b-a});
        
            //Lieber im Schleifendurchlauf immer 2 Schritte machen
            if(isIncludingGaps){
                länge = daten.length/2;
            }else{
                länge=daten.length-1;
            }
        
            let data2;
            data2 = [];

            // const 
            let mapIndex = 0;
            for (let index = 0; index < daten.length; index++) {
                let blockBoders = {rightBorder : daten[index],leftBorder : daten[index+1]};
                visualisationData.blockMap.set(mapIndex , blockBoders);
                mapIndex++, index++;                
            }
            // console.log("Blockmap size "+visualisationData.blockMap.size);

            let blocks,blocks_scaled;
            blocks=[],blocks_scaled=[];
            for (let index = 0; index < visualisationData.blockMap.size; index++) {
                //Aufruf der Visualisierungs-Parameter-Berechnungsfunktionen
                let visualizationParameters;
                visualizationParameters = calculateBlockParameters(
                    visualisationData.blockMap.get(visualisationData.blockMap.size-(index+1)).leftBorder,
                    visualisationData.blockMap.get(visualisationData.blockMap.size-(index+1)).rightBorder,
                    w,
                    processedInputValues.bottomBorder,processedInputValues.topBorder,
                    offsetLeft,
                    offsetRight
                    );
                //eventuell Offset mit einbeziehen
                let visualizationParametersSpecialCases = checkSpecialCases(
                    visualizationParameters.intervalStart,
                    visualizationParameters.intervalEnd,
                    visualizationParameters.stepWidth,
                    isBottomInfinite,
                    isTopInfinite,
                    index,
                    visualisationData.blockMap.size,
                    processedInputValues.isIncludingTop,
                    processedInputValues.isIncludingBottom,
                    processedInputValues.isIncludingGaps,
                    w
                    );

                blocks.push(visualizationParameters);
                blocks_scaled.push(visualizationParametersSpecialCases);
            }

            // console.log("blocks");
            // console.log(blocks);
            // console.log("blocks_scaled");
            // console.log(blocks_scaled);

            for (let i = 0; i < blocks.length; i++) {
                const blockData = blocks[i];
                const scaledBlockData = blocks_scaled [i];
                
                svg.selectAll("Bar")
                    .data(daten)
                    .enter()
                    .append("rect")
                    .attr("x", scaledBlockData.intervalStart)
                    .attr("y", 2)
                    .attr("width", scaledBlockData.scaledWidth)
                    .attr("height", 48)
                    .attr("opacity", 50)
                    .attr("fill", green);
                    if(!isBottomInfinite||!(!isIncludingGaps||i===0)){
                        //Linke Grenze des Balken wird mit einer dunkelgrünen Klammer markiert
                    svg.append('path')
                        .attr('d', d3.line()([[scaledBlockData.intervalStart+10,2], [scaledBlockData.intervalStart, 2], [scaledBlockData.intervalStart, 50], [scaledBlockData.intervalStart+10, 50]]))
                        .attr('stroke', dark_green)
                        .attr('stroke-width', 4)
                        .attr('fill', 'none');
                    }
                    //Rechte Grenze des Balken wird mit einer dunkelgrünen Klammer markiert
                    if(!isTopInfinite||!(!isIncludingGaps||i===blocks.length-1)){
                        svg.append('path')
                        .attr('d', d3.line()([[scaledBlockData.intervalEnd-10,2], [scaledBlockData.intervalEnd, 2], [scaledBlockData.intervalEnd, 50], [scaledBlockData.intervalEnd-10, 50]]))
                        .attr('stroke', dark_green)
                        .attr('stroke-width', 4)
                        .attr('fill', 'none');
                    }
            }
                let tick = visualisationData.visualTopBorder-visualisationData.visualBottomBorder;
                var x = d3.scaleLinear()
                .domain([visualisationData.visualBottomBorder, visualisationData.visualTopBorder])
                .range([25, w-25]);
                let xAxisGenerator = d3.axisBottom(x)
                if(tick>10){
                    tick=10;
                }
                if(isTopInfinite){
                    if (isIncludingGaps) {
                        
                    }else{
                        tick=2;
                        let tickLabels = [visualisationData.visualBottomBorder,'∞'];
                        xAxisGenerator.tickFormat((d,i) => tickLabels[i]);
                        xAxisGenerator.tickValues([visualisationData.visualBottomBorder,visualisationData.visualTopBorder]);
                    }
                }else if (isBottomInfinite) {
                    if (isIncludingGaps) {

                    }else{
                        tick=3;
                        let tickLabels = ['-∞',visualisationData.visualTopBorder];
                        xAxisGenerator.tickFormat((d,i) => tickLabels[i]);
                        xAxisGenerator.tickValues([visualisationData.visualBottomBorder,visualisationData.visualTopBorder]);
        
                    }
                    
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
                }
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

/*
Funktion zur Berechnung der generellen Start- und Endkoordinate eines Blocks
*/
function calculateBlockParameters(startValue,endValue,drawingWidth,visStartValue,visEndValue,offsetLeft,offsetRight){
    const blockParameters={};
    blockParameters['intervalLength'] = endValue - startValue;
    //Anzahl der Werte, die in der Visualisierung abgebildet werden
    let totalSteps = visEndValue - visStartValue;
    //Breite der Fläche innerhalb derer der Zahlenstrahl gezeichnet werden soll
    let graphWidth = drawingWidth - (offsetLeft + offsetRight);
    blockParameters['graphWidth']=graphWidth;
    //anteilige Breite eines Schrittes an der Gesamtbreite
    let stepWidth = graphWidth/totalSteps;
    //Schrittgröße zur Ermittlung der oberen und unteren Begrenzung sollte 
    //zur Übersichtlichkeit nie weniger als 3% der Gesamtbreite sein
    if(stepWidth<graphWidth*(3/100)){
        stepWidth=graphWidth*(3/100);
    }
    blockParameters['stepWidth']=stepWidth;
                
    //Berechnung der Startposition des Blocks in der Grafischen Zeichenfläche
    blockParameters['intervalStart'] = offsetLeft+(startValue-visStartValue)*(stepWidth);
    blockParameters['intervalEnd'] = offsetLeft+(endValue-visStartValue)*(stepWidth);

    return blockParameters;
}

function checkSpecialCases(startValue,endValue,setpWidth,isBottomInfinite,isTopInfinite,index,numberOfValues,isIncludingTopValue,isisIncludingBottomValue,isisIncludingGaps,drawingWidth){
    const blockParameters = {};
    let isLastIndex = false;
    if (index === numberOfValues-1) {
        isLastIndex = true;
    }
    let isFirstIndex = false;
    if (index === 0) {
        isFirstIndex = true;
    }
    //Für den Fall, dass es sich um den letzten Block handelt 
    //und dieser nicht begrenzt ist, wird die Intervallgrenze auf den rechten Rand der Grafik gelegt.
    if(isTopInfinite && isLastIndex){
        blockParameters['intervalEnd']=drawingWidth;
    }
    //Für den Fall, dass es sich um den ersten Block handelt 
    //und dieser nicht begrenzt ist, wird die Intervallgrenze auf den linken Rand der Grafik gelegt.
    if (isBottomInfinite && isFirstIndex) {
        blockParameters['intervalStart']=0;
    }
    //Wenn es der letzte Block ist und dieser oben begrenzt ist, aber der Wert nicht mit in den Wertebereich 
    //Eingeschlossen wird, wird die Grenze einen halben Schritt nach links verschoben
    if (!isTopInfinite && isLastIndex && !isIncludingTopValue) {
        blockParameters['intervalEnd']=endValue-setpWidth/2;
    }
    //Wenn es der erste Block ist, dieser unten begrenzt ist, aber der Wert nicht in den Wertebereich
    //Eingeschlossen wird, wird die Grenze um einen halben Schritt nach rechts verschoben
    if (!isBottomInfinite && isFirstIndex && !isisIncludingBottomValue) {
        blockParameters['intervalStart']=startValue+setpWidth/2;
    }
    //für den Fall, dass es eine Lücke im Wertebereich gibt, werden die Start-Koordinaten aller Blöcke, die nicht 
    //der erste Block sind, einen halben Schritt nach rechts verschoben
    if (!isFirstIndex) {
        blockParameters['intervalStart']=startValue+setpWidth/2;
    }
    //Für den Fall, dass es eine Lücke im Wertebereich gibt, werden die End-Koordinaten aller Blöcke, die nicht 
    //der letzte Block sind, einen halben Schitt nach links verschoben
    if (!isLastIndex) {
        blockParameters['intervalEnd']=endValue-setpWidth/2;
    }

    blockParameters['scaledWidth'] = Math.abs(blockParameters['intervalStart']-blockParameters['intervalEnd']);

    return blockParameters;
}
function reset(CookieName){
  dataHandler('delete', 0, CookieName);
  location.reload();
}

const Zahlenstrahl: React.FunctionComponent = (name) => {
  const data =[name];
  var rawInputValues ;
        rawInputValues = data.pop();
  const svg = React.useRef<SVGSVGElement>(null);
  React.useEffect(() => {
  }, [svg]);
  drawSvg(svg,rawInputValues.name);
  return (
    <div >
        <div>{rawInputValues.name}</div>
      <svg ref={svg} id={rawInputValues.name} />
      <br/>
      <button onClick={() => drawSvg(svg,rawInputValues.name)} >Visualisierung Anzeigen</button>
      <button onClick={() => reset(rawInputValues.name)} >Reset</button>
    </div>
  );
};

export default Zahlenstrahl;