let url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";
 
let dataSet;
let movies;
let root;

let scalex;
let scaley;

let w = 900;
let h = 600;
 let padding= 10;

let colors = ["#00FFFF", "#1f2367", "#eec900", "#d921cf", "#330d38", "#621e2c", "#dfe4fc"]

let text = ["Action", "Drama", "Adventure", "Family", "Animation", "Comedy", "Biography"]

let canves = d3.select("#canves");
let legend = d3.select("#legend");
let drawCanves=()=>{
  
  legend.attr("height", 150)
        .attr("width", 800)
 
  canves.attr("height", h)
        .attr("width", w)
 
}

let drawTreeMap =()=>{
let tooltip = d3.select("body")
                  .append("div")
                  .attr("id", "tooltip")
                 .style("visibility", "hidden")
                 .style("height", "auto")
                 .style("width", "auto")
  
  scalex = d3.scaleLinear()
             .domain([0, 6])
             .range([30, 600])
  
  legend.selectAll("rect")
        .data(colors)
        .enter()
        .append("rect")
        .attr("class", "legend-item")
        .attr("height", 20)
        .attr("width", 20)
        .attr("x", (d, i)=>{
    return scalex(i)
  })
       .attr("fill", (d)=>d)
       .attr("y", 35)
       .attr("stroke", "black")
  
  legend.selectAll("text")
        .data(text)
        .enter()
        .append("text")
        .text((d)=> d)
        .attr("x", (d, i)=>{
    return scalex(i) + 25
  })
       .attr("fill", "black")
       .attr("font-size", "15px")
       .attr("y", 50)
  
  

  d3.treemap()
    .size([w, h])
    .padding(0)
    (root)
  
  canves.selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
      .attr("class", "tile")
      .attr('x', function (d) { return d.x0; })
      .attr('y', function (d) { return d.y0; })
      .attr('width', function (d) { return d.x1 - d.x0; })
      .attr('height', function (d) { return d.y1 - d.y0; })
      .style("stroke", "black")
      .style("fill", (d)=>{
   if (d.data.category === "Action") {
     return "#00FFFF"
   } else if (d.data.category === "Drama") {
     return "#1f2367"
   } else  if (d.data.category === "Adventure") {
     return "#eec900"
   } else if (d.data.category === "Family") {
     return "#d921cf"
   } else if (d.data.category === "Animation") {
     return "#330d38"
   } else  if (d.data.category === "Comedy") {
     return "#621e2c"
   } else if (d.data.category === "Biography") {
     return "#dfe4fc"
   }
  })
     .attr("data-name", (d) =>{
    return d.data.name
  })
     .attr("data-category", (d) =>{
    return d.data.category
  })
     .attr("data-value", (d) =>{
    return d.data.value
  })
.on("mouseover", (d)=>{
      tooltip.transition()
          .style("visibility", "visible")
          .style("top", (event.pageY + 50) + "px")
          .style("left", (event.pageX - 15) + "px")
    tooltip.text("Name: " + d.data.name + "\n" + "Category: " + d.data.category + "\n" + "Value: " + d.data.value)
          .attr("data-value", d.data.value)
  })
    .on("mouseleave", (d)=>{
    tooltip.transition()
           .style("visibility", "hidden")
  })
 
  canves.selectAll('text')
      .data(root.leaves())
      .enter()
      .append('text')
      .selectAll('tspan')
      .data(d => {
          return d.data.name.split(/(?=[A-Z][^A-Z])/g) // split the name of movie
              .map(v => {
                  return {
                      text: v,
                      x0: d.x0,                        // keep x0 reference
                      y0: d.y0                         // keep y0 reference
                  }
              });
      })
      .enter()
      .append('tspan')
      .attr("x", (d) => d.x0 + 5)
      .attr("y", (d, i) => d.y0 + 15 + (i * 10))       // offset by index 
      .text((d) => d.text)
      .attr("font-size", "0.6em")
      .attr("fill", "black");


  

}

d3.json(url).then((data, error)=>{
  if (error){
    console.log(error)
  } else{
    dataSet = data;
 root = d3.hierarchy(dataSet).sum(function(d){ return d.value}).sort((d, b)=>{
   return b.value - d.value
 })
console.log(root.data.children[0].name)
drawCanves()
drawTreeMap()    
  }
})