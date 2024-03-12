const totalstandardstext = document.getElementById("totalstandards")

const margin = {top: 20, right: 30, bottom: 40, left: 200},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);






// Parse the Data
function draw(data) {
  console.log(data)
  
  var totalstandards = 0;

  for (let value in data) {
    totalstandards += parseInt(value);
  }
  var statii = ["draft", "published"]

  var color = d3.scaleOrdinal()
    .domain(statii)
    .range(['orange','darkorange'])
  
  console.log(totalstandards);

  totalstandardstext.innerHTML = totalstandards + " Result" + (totalstandards > 1 ? "s" : "");

  // Add X axis
  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.total) + 1])
    .range([ 0, width]);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Y axis
  const y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(d => d.title))
    .padding(.1);
  svg.append("g")
    .call(d3.axisLeft(y))

  console.log(d3.max(data, d => d.total))

  //Bars

  for (var i = 0; i < statii.length; i++) {
    svg.selectAll("draftRect")
      .data(data)
      .join("rect")
      .attr("x", x(0) + 1)
      .attr("y", d => y(d.title))
      .attr("width", d => x(i == 0 ? d.total : d[statii[i]]))
      .attr("height", y.bandwidth())
      .attr("fill", color(statii[i]))

      var reverse_index = statii.length - 1 - i
      svg.append("text")
        .attr("x", 20+(i*80))
        .attr("y", 0)
        .text(statii[reverse_index])
        .attr("fill", color(statii[reverse_index]))

  }
}