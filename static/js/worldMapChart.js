const EUCountries = []

// The svg
const svg = d3.select("#worldMapChart");
    width = +svg.attr("width"),
    height = +svg.attr("height");

const selectedCoutnryText = d3.select("#selectedCountryText");

// Map and projection
const path = d3.geoPath();
const projection = d3.geoMercator()
  .scale(70)
  .center([0,20])
  .translate([width / 2, height / 2]);

// Data and color scale
const data = new Map();
const colorScale = d3.scaleThreshold()
  .domain([1,2,7])
  .range(d3.schemeBlues[3]);


function juris(loadData){
    console.log(loadData)

        let topo = loadData["geodata"];

        loadData["regcount"].forEach(d => 
            // console.log(+d.total, d.code)
            data.set(d.code, +d.total)
        )
        // console.log(data)
        // xxx

        let mouseOver = function(d) {
        d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .5)
        d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("stroke", "black")
        selectedCoutnryText.text(this.getAttribute("data-country") + " (" + this.getAttribute("data-total") + ")")//;d.properties.name);
    }

    let mouseLeave = function(d) {
        d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .8)
        d3.select(this)
        .transition()
        .duration(200)
        .style("stroke", "none")
        selectedCoutnryText.text("International");
    }

    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        // draw each country
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        // set the color of each country
        .attr("fill", function (d) {
            d.total = data.get(d.id) || 0;
            return colorScale(d.total);
        })
        .style("stroke", "transparent")
        .attr("class", function(d){ return "Country " + d.properties.name})
        .attr("data-country", function(d){return d.properties.name})
        .attr("data-code", function(d){return d.id})
        .attr("data-total", function(d){return d.total})
        .style("opacity", .8)
        .on("mouseover", mouseOver)
        .on("mouseleave", mouseLeave)
        .on("click", mouseOver)

}

