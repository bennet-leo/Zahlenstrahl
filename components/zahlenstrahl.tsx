import * as React from 'react';
import * as d3 from "d3";
import cookieCutter from 'cookie-cutter';
// import cookie from "js-cookie";

let dataTable = {
    table: []
};

async function LoadData(){

        // let data = getCookie("MyCookie");
         const data = cookieCutter.get('MyCookie');
        
        if(data!=='{}'){
            dataTable = JSON.parse(data); 
        }else{
            console.log("Cookie Anzeige abgebrochen");
            return 0;
        }
}
// function setCookie(cname,cvalue) {
//     const exdays = 30;
//     const d = new Date();
//     d.setTime(d.getTime() + (exdays*24*60*60*1000));
//     let expires = "expires=" + d.toUTCString();
//     document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
//   }

//   function getCookie(cname) {
//     let name = cname + "=";
//     let decodedCookie = decodeURIComponent(document.cookie);
//     let ca = decodedCookie.split(';');
//     for(let i = 0; i < ca.length; i++) {
//       let c = ca[i];
//       while (c.charAt(0) == ' ') {
//         c = c.substring(1);
//       }
//       if (c.indexOf(name) == 0) {
//         return c.substring(name.length, c.length);
//       }
//     }
//     return "";
//   }


function drawSvg(svgRef: React.RefObject<SVGSVGElement>) {
    // const data = [12, 5, 6, 6, 9, 10];
    const data = [12, 5, 6, 6, 9, 10];
  const h = 120;
  const w = 250;
  const svg = d3.select(svgRef.current);

  https://github.com/jeremyholcombe/d3-interactive-number-line/blob/master/number-line.js

  svg
    .attr("width", w)
    .attr("height", h)
    .style("margin-top", 50)
    .style("margin-left", 50);

  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * 40)
    .attr("y", (d, i) => h - 10 * d)
    .attr("width", 20)
    .attr("height", (d, i) => d * 10)
    .attr("fill", "steelblue");
}

const Zahlenstrahl: React.FunctionComponent = () => {
  const svg = React.useRef<SVGSVGElement>(null);
     LoadData();
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