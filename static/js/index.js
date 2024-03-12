// const urls = [pieChartDataUrl, barChartDataUrl];

// Promise.all(urls.map(url => d3.json(url))).then(run);

// function run(dataset) {
//    d3PieChart(dataset[0], dataset[1]);
//    d3BarChart(dataset[1]);
// };

console.log("index")
Promise.all([
    d3.json(geojsonDataUrl),    
    // d3.csv(populationDataUrl, function(d) {
    //     data.set(d.code, +d.pop)
    // }),
    // d3.csv(organisationDataUrl, function(d) {
    //     data.set(d.code, d.organisation)
    // })
    d3.json(regulationDataUrl, function(d) {
        d3.group(data, (d) => d.country);
    }),
    d3.json(regulationDataUrl)
]).then(run)
        

// Promise.all(jsonurls.map(url => d3.json(jsonurls))).then(run);

function run(dataset) {
    // 0 = geojson, 1 = grouped data, 2 = individual data
    console.log("run")
    console.log("run", dataset)
    juris(dataset);
}