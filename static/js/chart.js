var margin = {top: 20, right: 20, bottom: 30, left: 80},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

var x = techan.scale.financetime()
        .range([0, width]);
var y = d3.scaleLinear()
        .range([height, 0]);

var candlestick = techan.plot.candlestick()
        .xScale(x)
        .yScale(y);

// annotation stuff
var xAxis = d3.axisBottom(x);
var yAxis = d3.axisLeft(y);

var ohlcAnnotation = techan.plot.axisannotation()
        .axis(yAxis)
        .orient('left')
        .format(d3.format(',.2f'));

var timeAnnotation = techan.plot.axisannotation()
        .axis(xAxis)
        .orient('bottom')
        .format(d3.timeFormat('%Y-%m-%d'))
        .width(100)
        .translate([0, height]);

var crosshair = techan.plot.crosshair()
        .xScale(x)
        .yScale(y)
        .xAnnotation([timeAnnotation])
        .yAnnotation([ohlcAnnotation])

var svg = d3.select("#chart")
        .append("div")
        .classed("svg-container", true) //container class to make it responsive
        .append("svg")
        // .attr("width", totalWidth)
        // .attr("height", totalHeight)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 960 500")
        .classed("svg-content-responsive", true)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var accessor = candlestick.accessor();

svg.append("g")
        .datum([])
        .attr("class", "candlestick")
        .call(candlestick);


svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

svg.append('g')
        .attr("class", "crosshair")
        .datum({ x: x.domain()[80], y: y.domain()[5] })
        .call(crosshair)

var updateChart = function(currData) {
    currData = currData.map(function(d) {
        return {
            date: new Date(d.time * 1000),
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
            volume: d.volumeto
        };
    }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });

    x.domain(currData.map(accessor.d));
    y.domain(techan.scale.plot.ohlc(currData, accessor).domain());

    svg.selectAll("g.candlestick").datum(currData).call(candlestick);
    svg.selectAll("g.x.axis").call(xAxis);
    svg.selectAll("g.y.axis").call(yAxis);
    svg.selectAll("g.crosshair").call(crosshair);
}

axios.get("https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=USD&limit=150")
.then(function(res) {
    var data = res.data.Data
    updateChart(data)
})