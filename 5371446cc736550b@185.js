// https://observablehq.com/d/5371446cc736550b@185
import define1 from "./a33468b95d0b15b0@692.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["walmart.tsv",new URL("./files/584765eba3dde077d5e14795a23179b06f32e3d8acdb624972812fffb82c232b3222dd85724740394d9f76a73b4fc340ccc4db8015b7995b7562e5d2fa9577ca",import.meta.url)],["states-albers-10m.json",new URL("./files/0d8fa65dce2397df03b75fb4fabbc7d79e2794ef64f018bdd1dd43460bc3795743e69dbf1d7456791cbef424e272d5cd33f49e3e445ce78f9a53ef5e5755e16e",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Hexbin Map

This map shows approximately 3,000 locations of Walmart stores. The hexagon area represents the number of stores in the vicinity, while the color represents the median age of these stores. Older stores are red, and newer stores are blue.`
)});
  main.variable(observer("chart")).define("chart", ["d3","width","height","legend","color","data","topojson","us","hexbin","radius"], function(d3,width,height,legend,color,data,topojson,us,hexbin,radius)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  svg.append("g")
      .attr("transform", "translate(610,20)")
      .append(() => legend({
        color, 
        title: data.title, 
        width: 260, 
        tickValues: d3.utcYear.every(5).range(...color.domain()),
        tickFormat: d3.utcFormat("%Y")
      }));

  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states))
      .attr("fill", "none")
      .attr("stroke", "#777")
      .attr("stroke-width", 0.5)
      .attr("stroke-linejoin", "round")
      .attr("d", d3.geoPath());

  svg.append("g")
    .selectAll("path")
    .data(data)
    .join("path")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .attr("d", d => hexbin.hexagon(radius(d.length)))
      .attr("fill", d => color(d.date))
      .attr("stroke", d => d3.lab(color(d.date)).darker())
    .append("title")
      .text(d => `${d.length.toLocaleString()} stores
${d.date.getFullYear()} median opening`);

  return svg.node();
}
);
  main.variable(observer("data")).define("data", ["d3","FileAttachment","projection","parseDate","hexbin"], async function(d3,FileAttachment,projection,parseDate,hexbin)
{
  const data = d3.tsvParse(await FileAttachment("walmart.tsv").text(), d => {
    const p = projection(d);
    p.date = parseDate(d.date);
    return p;
  });
  return Object.assign(
    hexbin(data)
      .map(d => (d.date = new Date(d3.median(d, d => d.date)), d))
      .sort((a, b) => b.length - a.length),
    {title: "Median opening year"}
  );
}
);
  main.variable(observer("projection")).define("projection", ["d3"], function(d3){return(
d3.geoAlbersUsa().scale(1300).translate([487.5, 305])
)});
  main.variable(observer("parseDate")).define("parseDate", ["d3"], function(d3){return(
d3.utcParse("%m/%d/%Y")
)});
  main.variable(observer("color")).define("color", ["d3","data"], function(d3,data){return(
d3.scaleSequential(d3.extent(data, d => d.date), d3.interpolateSpectral)
)});
  main.variable(observer("radius")).define("radius", ["d3","data","hexbin"], function(d3,data,hexbin){return(
d3.scaleSqrt([0, d3.max(data, d => d.length)], [0, hexbin.radius() * Math.SQRT2])
)});
  main.variable(observer("hexbin")).define("hexbin", ["d3","width","height"], function(d3,width,height){return(
d3.hexbin().extent([[0, 0], [width, height]]).radius(10)
)});
  main.variable(observer("width")).define("width", function(){return(
975
)});
  main.variable(observer("height")).define("height", function(){return(
610
)});
  main.variable(observer("us")).define("us", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("states-albers-10m.json").json()
)});
  main.variable(observer("topojson")).define("topojson", ["require"], function(require){return(
require("topojson-client@3")
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5", "d3-hexbin@0.2")
)});
  const child1 = runtime.module(define1);
  main.import("legend", child1);
  return main;
}
