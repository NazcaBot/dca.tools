// var markets = {}
var coinNames = []
var nameToSymbol = {}

// Get available markets
axios.get("https://min-api.cryptocompare.com/data/all/coinlist")
.then(function(res) {
    var res = res.data.Data
    for (m in res) {
        coinNames.push(res[m].FullName)
        nameToSymbol[res[m].FullName] = res[m]
    }
})
.catch(function (err) {
    console.log(err)
})

var demo = new autoComplete({
    selector: '#base_currency',
    minChars: 1,
    source: function(term, suggest){
        term = term.toLowerCase();
        var suggestions = coinNames.filter(function (c) {
            return ~c.toLowerCase().indexOf(term)
        })
        suggest(suggestions);
    },
    onSelect: function(e, term, item) {
        var base = nameToSymbol[term].Symbol
        var quote = "USD"
        fetchChartData(quote, base)
    }
})
