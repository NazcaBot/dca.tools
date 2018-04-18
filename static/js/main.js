// var markets = {}
var coins = []
var coinNames = []
var nameToSymbol = {}

// Get available markets
axios.get("https://min-api.cryptocompare.com/data/all/coinlist")
.then(function(res) {
    var res = res.data.Data
    for (m in res) {
        res[m].SortOrder = parseInt(res[m].SortOrder)
        coins.push(res[m])
        nameToSymbol[res[m].FullName] = res[m]
    }

    coins.sort(function(a, b) {
        return a.SortOrder - b.SortOrder;
    })

    coinNames = coins.map(function(c) { return c.FullName })

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
        var quote_select = document.getElementById("quote_currency");
        var quote = quote_select.options[quote_select.selectedIndex].value;

        fetchChartData(quote, base)
    }
})
