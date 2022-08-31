import * as React from 'react';
import * as d3 from "d3";
import cookieCutter from 'cookie-cutter';

async function processDataTable(Cookiename){


    let daten ={
        a:'undefined',
        topBorder :'undefined',
        bottomBorder :'undefined',
        aGefunden : false,
        includingBottom : false,
        includingTop : false,
        includingGaps : false,
        nichtDefiniert : false,
        gaps : []
    }

    let gaps;
    gaps= [] ;
    let data;
    var cookie = require('cookie-cutter');
    // cookieCutter = require('cookie-cutter');
    data = cookie.get(Cookiename);
   // console.log("Cookiename "+typeof Cookiename + " " + Cookiename);
   // console.log("data "+typeof data + " " + data);
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
      // console.log("Keine Daten vorhanden");
        return 0;
    }
    let localTable = dataTable;
    var length = localTable.table.length;
    let loopcount =0;
    daten.topBorder = 'max';
    daten.bottomBorder = 'min';
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
            let rawData;
            rawData = content.val;
            switch (content.op) {
            case '<':
                //Wenn in topBorder 'min' steht, oder der gegenwärtige Wert kleiner, 
                //als der bisher größte eingetragene Wert ist wird der gegenwärtige Wert
                //in topBorder notiert und die Inklusion abgeschaltet
                if(typeof daten.topBorder!=='number' || daten.topBorder>value){
                    daten.topBorder = value;
                    daten.includingTop = false;
                }
                break;
            case '>':
                //Wenn in Bottomborder 'min' steht, oder der gegenwärtige Wert größer, 
                //als der bisher größte eingetragene Wert ist wird der gegenwärtige Wert
                //in BottomBorder notiert und die Inklusion abgeschaltet
                if(typeof daten.bottomBorder!=='number' || daten.bottomBorder<value){
                    daten.bottomBorder = value;
                    daten.includingBottom = false;
                }
                break;
            case '≥':
                //Wenn in Bottomborder 'min' steht, oder der gegenwärtige Wert größer, 
                //als der bisher größte eingetragene Wert ist wird der gegenwärtige Wert
                //in BottomBorder notiert und die Inklusion eingeschaltet, da a auch den Wert annehmen kann
                if(typeof daten.bottomBorder!=='number' || daten.bottomBorder<value){
                    daten.bottomBorder = value;
                    daten.includingBottom = true;
                }
                break;
            case '≤':
                //Wenn in topBorder 'min' steht, oder der gegenwärtige Wert kleiner, 
                //als der bisher größte eingetragene Wert ist wird der gegenwärtige Wert
                //in topBorder notiert und die Inklusion eingeschaltet, da a auch den Wert annehmen kann.
                if(typeof daten.topBorder!=='number' || daten.topBorder>value){
                    daten.topBorder = value;
                    daten.includingTop = true;
                }
                
                break;
            case '=':
              // console.log("A gefunden")
              daten.a=value;
            //   daten.aGefunden=true;
            if(typeof daten.topBorder!=='number' || daten.topBorder>value){
                daten.topBorder = value + 1;
                daten.includingTop = false;
            }
            if(typeof daten.bottomBorder!=='number' || daten.bottomBorder<value){
                daten.bottomBorder  = (value - 1) as unknown as string;
                daten.includingBottom = false;
            }
                break;
            case '!=':
                gaps.push(value)
                daten.includingGaps=true;
                break;
        
            default:
                break;
            }
        }
    }
    daten.gaps=gaps;
    if(daten.bottomBorder>daten.topBorder){
        daten.nichtDefiniert = true;
    }

// console.log("Top Border: " + daten.topBorder + " including: " + daten.includingTop )
// console.log("Bot Border: " + daten.bottomBorder + " including: " + daten.includingBottom)
// console.log("a: " + daten.a + " gefunden: " + daten.aGefunden)
// console.log("gaps: " + daten.gaps + " including: " + daten.includingGaps)
  return daten;
}

        async function drawSvg(svgRef: React.RefObject<SVGSVGElement>,name) {

            let datenStruct;
            datenStruct ={
                a:0,
                topBorder :0,
                bottomBorder :0,
                aGefunden : false,
                includingBottom : false,
                includingTop : false,
                includingGaps : false,
                nichtDefiniert : false,
                gaps : []
            } 

            let tabledata = processDataTable(name);
            datenStruct = await tabledata.then();
           // console.log(datenStruct);
           // console.log(datenStruct.topborder)

            let a = datenStruct.a;
            let topBorder  = datenStruct.topBorder;
            let bottomBorder = datenStruct.bottomBorder ;
            let aGefunden  = datenStruct.aGefunden;
            let includingBottom  = datenStruct.includingBottom;
            let includingTop  = datenStruct.includingTop;
            let includingGaps  = datenStruct.includingGaps;
            let nichtDefiniert = datenStruct.nichtDefiniert;
            let gaps ;//
            gaps= [] ;
            gaps = datenStruct.gaps;


            let Cookiename = name;
         // console.log("DrawSVG gestartet für " + Cookiename + "und Name: " + name);
            const h = 60;
            const w = 600;
            const green =       '#4fbd53';
            const dark_green =  '#128006';
            const gray =        '#b5b5b5';
            const achsenHöhe = h-20;
            const breitederbalken = 0;
            const svg = d3.select(svgRef.current);
            // const svg = d3.select('#'+Cookiename)
            let data;// = [];
            data = [];
            let bot ;
            let top ;
        
        
        
            // console.log(typeof topBorder + " top border "+ topBorder)
            // console.log(typeof bottomBorder + " bot border "+ bottomBorder)
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
          svg
            .attr("width", w)
            .attr("height", h)
            .style("margin-top", 50)
            .style("margin-bottom", 5)
            .style("margin-left", 50)
            .style("margin-right", 50)
            .style("background-color",gray)
            .text('no');
        
            if(!aGefunden){
        let obenoffen = true;
        let untenoffen = true;
       // console.log("top " + topBorder);
       // console.log("bot " + bottomBorder);
        let pushedTop = false;
        let pushedBot = false;
        for (let index = 0; index < 2; index++) {
        
            if (!isNaN(bottomBorder)) {
                untenoffen = false;
                // console.log("unten geschlossen");
            }else{
                if (!obenoffen&&!pushedBot) {
                    if (includingGaps) {
                        const min = Math.min(...gaps);
                        bot=min-5; 
                    }else{
                        bot=topBorder-5; 
                    } 
                    data.push(bot);   
                    // console.log(" bot: " +bot +" in data gepusht länge: " + data.length );
                    pushedBot=true;
                }
            }
            if (!isNaN(topBorder)) {
                obenoffen = false;
                // console.log("oben geschlossen");
            }else{
                if (!untenoffen&&!pushedTop) {
                    if (includingGaps) {
                        const max = Math.max(...gaps);
                        top=max+5;
                    }else{
                        top=bottomBorder+5;
                    } 
                    data.push(top); 
                    // console.log(" top: " +top +" in data gepusht länge: " + data.length );
                    pushedTop=true;
                }
            }
            
        }
        
        // console.log("obenoffen: " + obenoffen);
        // console.log("untenoffen " + untenoffen);
        //Inhalte der Grafik werden erst generiert, wenn top und bot Zahlenwerte enthalten
            if(!isNaN(bot) && !isNaN(top)){
            let tick = top-bot;
            let data2;
            data2 = [];
        
            data.sort(function(a, b) {
                return a + b;
            });
            // console.log("data: " + data +" " + data.length );
            gaps.sort(function(a, b) {
                return a - b;
            });
            // console.log("gaps: " + gaps +" " + gaps.length );
            let gapsLänge = gaps.length;
            let daten_false_order;
            daten_false_order = [];
            //Lücken müssen ins array mit eingefügt werden
            daten_false_order.push(data.pop());
            for (let index = 0; index < gapsLänge; index++) {
                if(gaps[index]>bot &&gaps[index]<top){
                    daten_false_order.push(gaps[index]);
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
            daten.sort(function(a, b){return b-a});
        
            if(includingGaps){
                länge = daten.length/2;
            }else{
                länge=daten.length-1;
            }
        
            for (let index = 0; index < länge; index++) {    
                
                data2.push(daten.pop());
                let intervalllänge = daten[daten.length-1] - data2[0];
                let differenzStartEnde = Math.abs(top-bot);
                //unteres Ende des Intervalls
                let startskaliert= 25+(data2[0]-bot)*((w/(differenzStartEnde)));
                //oberes Ende des Intervalls
                let endeskaliert = (daten[daten.length-1]-bot)*((w/(differenzStartEnde)));
                if (daten.length===1) {
                    endeskaliert -=25;
                }
                let differenzStartEndelokal = Math.abs(endeskaliert - startskaliert);
                let stepskaliert = ((differenzStartEndelokal)/(differenzStartEnde));
        
                if (obenoffen&& (!includingGaps||index!=0)) {
                    endeskaliert = w;
                }
                if (untenoffen && (!includingGaps||index!=länge-1)) {
                    startskaliert = 0;
                }
        
        
                // console.log("daten: "+ daten);
                // console.log("länge: "+ länge);
                // console.log("intervalllänge: "+ intervalllänge);
                //wenn nur ein Wert im Array vorhanden ist
                // if(intervalllänge===0 && !nichtDefiniert){
                //     // startskaliert -= stepskaliert/3;
                //     // endeskaliert += stepskaliert/3;
                //     startskaliert = w/2-25;
                //     endeskaliert = w/2-25;
                //     bot = a-1;
                //     top = a+1
                //     // console.log("Daten manipuliert! ");
                // }
                   // console.log("Index = " + index);
                
                    if(index ===länge-1 && !includingTop &&!obenoffen){
                        endeskaliert -= stepskaliert/2;
                        // console.log("oben nicht eingeschlossen")
                    }
                    if(index===0 && !includingBottom&&!untenoffen){
                        startskaliert += stepskaliert/2;
                        // console.log("unten nicht eingeschlossen")
                    }
                    //Wenn es eine Lücke gibt
                    if (index !==länge-1 ) {
                        endeskaliert -= stepskaliert/2;
                    }            
                    if(index !==länge-1 && index!==0&&!obenoffen&&!untenoffen){
                        endeskaliert -= stepskaliert/2;
                        startskaliert += stepskaliert/2;
                        // console.log("überall geschlossen und Mittelteil")
                    }
                
        
                 
                // if(index===0 || index ===länge-1){
                //     if(!includingTop&&!obenoffen){
                //         endeskaliert -= stepskaliert/5;
                //         // console.log("oben nicht eingeschlossen")
                //     }
                //     if(!includingBottom&&!untenoffen){
                //         startskaliert += stepskaliert/5;
                //         // console.log("unten nicht eingeschlossen")
                //     }
                // }else{
                //     if(!obenoffen&&!untenoffen){
                //         endeskaliert -= stepskaliert/5;
                //         startskaliert += stepskaliert/5;
                //         // console.log("überall geschlossen und Mittelteil")
                //     }
                // }
        
        
                let breiteSkaliert = Math.abs(endeskaliert - startskaliert)
                
             // console.log("daten: "+ daten);
             // console.log("data2: "+ data2);
             // console.log("w: "+ w);
             // console.log("differenzStartEnde: "+ differenzStartEnde);
             // console.log("differenzStartEndelokal: "+ differenzStartEndelokal);
             // console.log("startskaliert: "+ startskaliert);
             // console.log("endeskaliert: "+ endeskaliert);
             // console.log("breiteSkaliert: "+ breiteSkaliert);
             // console.log("stepskaliert: "+ stepskaliert);
        
                svg.selectAll("rect"+name)
                    .data(daten)
                    .enter()
                    .append("rect")
                    .attr("x", startskaliert)//(d, i) => 25+(d-bot)*((w/(top-bot))-breitederbalken))
                    .attr("y", 2)
                    .attr("width", breiteSkaliert)
                    .attr("height", 48)
                    .attr("opacity", 50)
                    .attr("fill", green);
                    if(!untenoffen||!(!includingGaps||index!=länge-1)){
                    svg.append('path')
                        .attr('d', d3.line()([[startskaliert+10,2], [startskaliert, 2], [startskaliert, 50], [startskaliert+10, 50]]))
                        .attr('stroke', dark_green)
                        .attr('stroke-width', 4)
                        .attr('fill', 'none');
                    }
                    if(!obenoffen||!(!includingGaps||index!=0)){
                        svg.append('path')
                        .attr('d', d3.line()([[endeskaliert-10,2], [endeskaliert, 2], [endeskaliert, 50], [endeskaliert-10, 50]]))
                        .attr('stroke', dark_green)
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
                //let tick = top-bot;
                // console.log("Typ von bot: " + tick)
                if(tick>10){
                    tick=10;
                }
                if(obenoffen){
                    if (includingGaps) {
                        
                        // tick=3;
                        // xAxisGenerator.tickValues([bot,top]);
                    }else{
                        tick=2;
                        let tickLabels = [bot,'∞'];
                        xAxisGenerator.tickFormat((d,i) => tickLabels[i]);
                        xAxisGenerator.tickValues([bot,top]);
                    }
                }else if (untenoffen) {
                    if (includingGaps) {
                        
                        // tick=3;
                        // xAxisGenerator.tickValues([bot,top]);
                    }else{
                        tick=3;
                        let tickLabels = ['-∞',top];
                        xAxisGenerator.tickFormat((d,i) => tickLabels[i]);
                        xAxisGenerator.tickValues([bot,top]);
        
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
            }else{
                  // console.log("a gefunden");
                    //Wenn a direkt eingegeben wird, kasten bei a zeichnen und fertig.
                    svg.selectAll("rect_a")
                        .data([1,2])
                        .enter()
                        .append("rect")
                        .attr("x", w/2-25)//(d, i) => 25+(d-bot)*((w/(top-bot))-breitederbalken))
                        .attr("y", 2)
                        .attr("y", 2)
                        .attr("width", 50)
                        .attr("height", 48)
                        .attr("opacity", 50)
                        .attr("fill", green);
        
                    svg.append('path')
                        .attr('d', d3.line()([[w/2-25+10,2], [w/2-25, 2], [w/2-25, 50], [w/2-25+10, 50]]))
                        .attr('stroke', dark_green)
                        .attr('stroke-width', 4)
                        .attr('fill', 'none');
        
                    svg.append('path')
                        .attr('d', d3.line()([[w/2+25-10,2], [w/2+25, 2], [w/2+25, 50], [w/2+25-10, 50]]))
                        .attr('stroke', dark_green)
                        .attr('stroke-width', 4)
                        .attr('fill', 'none');
        
                    let xScale = d3.scaleLinear()
                        .domain([a-1, a+1])
                        .range([0, w]);
                    let xAxisGenerator = d3.axisBottom(xScale);
                    xAxisGenerator.ticks(1);
                    xAxisGenerator.tickValues([a]);
                    xAxisGenerator.tickSize(-5);
                    
                    let tickLabels = [a];
                    xAxisGenerator.tickFormat((d,i) => tickLabels[i]);
                    xAxisGenerator.tickValues([a]);
        
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
const Zahlenstrahl: React.FunctionComponent = (name) => {
  const data =[name];
  var content ;
        content = data.pop();
 // console.log( content.name);
//   Cookiename = content.name;
  const svg = React.useRef<SVGSVGElement>(null);
  processDataTable(content.name);
 // console.log("Call drawSvg für " + content.name);
  React.useEffect(() => {
    drawSvg(svg,content.name);
  }, [svg]);


// var nom = 'abc';
// window[nom] = 'something';
// alert(abc);
// console.log(svg);

  return (
    <div >
        <div>{content.name}</div>
      <svg ref={svg} id={content.name} />
    </div>
  );
};

export default Zahlenstrahl;