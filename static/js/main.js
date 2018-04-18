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
        var coin = nameToSymbol[term]
        var base = coin.Symbol
        var quote_select = document.getElementById("quote_currency");
        var quote = quote_select.options[quote_select.selectedIndex].value;

        fetchCoinStats(coin, quote, base)
        fetchChartData(quote, base)
    }
})


var fetchCoinStats = function(coin, quote, base) {
    quote = quote.toUpperCase()
    base = base.toUpperCase()
    axios.get("https://min-api.cryptocompare.com/data/pricemultifull?fsyms="+base+"&tsyms="+quote)
    .then(function(res) {
        var display = res.data.DISPLAY[base][quote]
        var raw = res.data.RAW[base][quote]
        /*
            icon
            name
            24hr price % + price
            24hr volume
            marketcap

        */
        var data = {
            icon: coin.ImageUrl,
            price: { raw: raw.PRICE, display: display.PRICE },
            price24hrChange: { raw: raw.CHANGEPCT24HOUR, display: display.CHANGEPCT24HOUR },
            volume24hr: { raw: raw.VOLUME24HOURTO, display: display.VOLUME24HOURTO },
            marketCap: { raw: raw.MKTCAP, display: display.MKTCAP }
        }

        console.log(data)
    })
}


/* Element selectors */

// initial inputs
var initial_rate_INPUT = document.getElementsByName("initial_rate_INPUT")[0]
var initial_num_coins_INPUT = document.getElementsByName("initial_num_coins_INPUT")[0]

// initial/current calculations
var current_avgrate_CALC = document.getElementById('current_rate_CALC')
var current_position_CALC = document.getElementById('current_position_CALC')
var initial_value_CALC = document.getElementById('initial_value_CALC')
var current_value_CALC = document.getElementById('current_value_CALC')
var initial_balance_CALC = document.getElementById('initial_balance_CALC')

// target inputs
var target_position_INPUT = document.getElementsByName("target_position_INPUT")[0]
var target_investment_INPUT = document.getElementsByName("target_investment_INPUT")[0]
var target_rate_INPUT = document.getElementsByName("target_rate_INPUT")[0]

// target calculations
var target_avgrate_CALC = document.getElementById('target_avgrate_CALC')
var target_position_CALC = document.getElementById('target_position_CALC')
var target_value_CALC = document.getElementById('target_value_CALC')
var target_balance_CALC = document.getElementById('target_balance_CALC')
