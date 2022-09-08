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
              daten.a=value;
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
            const h = 60;
            const w = 600;
            const green =       '#4fbd53';
            const dark_green =  '#128006';
            const gray =        '#b5b5b5';
            const achsenHöhe = h-20;
            const svg = d3.select(svgRef.current);
            let data;
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
          svg
            .attr("width", w)
            .attr("height", h)
            .style("margin-top", 50)
            .style("margin-bottom", 5)
            .style("margin-left", 50)
            .style("margin-right", 50)
            .style("background-color",gray)
            .text('no');
        
        let obenoffen = true;
        let untenoffen = true;
        let pushedTop = false;
        let pushedBot = false;
        for (let index = 0; index < 2; index++) {
        
            if (!isNaN(bottomBorder)) {
                untenoffen = false;
            }else{
                if (!obenoffen&&!pushedBot) {
                    if (includingGaps) {
                        const min = Math.min(...gaps);
                        bot=min-5; 
                    }else{
                        bot=topBorder-5; 
                    } 
                    data.push(bot);   
                    pushedBot=true;
                }
            }
            if (!isNaN(topBorder)) {
                obenoffen = false;
            }else{
                if (!untenoffen&&!pushedTop) {
                    if (includingGaps) {
                        const max = Math.max(...gaps);
                        top=max+5;
                    }else{
                        top=bottomBorder+5;
                    } 
                    data.push(top); 
                    pushedTop=true;
                }
            }
            
        }
        //Inhalte der Grafik werden erst generiert, wenn top und bot Zahlenwerte enthalten
            if(!isNaN(bot) && !isNaN(top)){
            let data2;
            data2 = [];
        
            data.sort(function(a, b) {
                return a + b;
            });
            gaps.sort(function(a, b) {
                return a - b;
            });
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
                
                if(index ===länge-1 && !includingTop &&!obenoffen){
                    endeskaliert -= stepskaliert/2;
                }
                if(index===0 && !includingBottom&&!untenoffen){
                    startskaliert += stepskaliert/2;
                }
                //Wenn es eine Lücke gibt
                if (index !==länge-1 ) {
                    endeskaliert -= stepskaliert/2;
                }            
                if(index !==länge-1 && index!==0&&!obenoffen&&!untenoffen){
                    endeskaliert -= stepskaliert/2;
                    startskaliert += stepskaliert/2;
                }
        
        
                let breiteSkaliert = Math.abs(endeskaliert - startskaliert)
        
                svg.selectAll("rect"+name)
                    .data(daten)
                    .enter()
                    .append("rect")
                    .attr("x", startskaliert)
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
        
                let tick = top-bot;
                var x = d3.scaleLinear()
                .domain([bot, top])
                .range([25, w-25]);
                let xAxisGenerator = d3.axisBottom(x)
                if(tick>10){
                    tick=10;
                }
                if(obenoffen){
                    if (includingGaps) {
                        
                    }else{
                        tick=2;
                        let tickLabels = [bot,'∞'];
                        xAxisGenerator.tickFormat((d,i) => tickLabels[i]);
                        xAxisGenerator.tickValues([bot,top]);
                    }
                }else if (untenoffen) {
                    if (includingGaps) {

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
  const svg = React.useRef<SVGSVGElement>(null);
  React.useEffect(() => {
    drawSvg(svg,content.name);
  }, [svg]);
  return (
    <div >
        <div>{content.name}</div>
      <svg ref={svg} id={content.name} />
    </div>
  );
};

export default Zahlenstrahl;