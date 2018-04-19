var coins = []
var coinNames = []
var nameToSymbol = {}
var quote = 'USD'
var base = 'ETH'

// currency inputs
var quote_currency_INPUT = document.getElementById("quote_currency_INPUT")
var base_currency_INPUT = document.getElementById("base_currency_INPUT")

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
    selector: '#base_currency_INPUT',
    minChars: 1,
    source: function(term, suggest){
        term = term.toLowerCase();
        var suggestions = coinNames.filter(function (c) {
            return ~c.toLowerCase().indexOf(term)
        })
        suggest(suggestions);
    },
    onSelect: function(e, term, item) {
        onCoinSelected()
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

var onCoinSelected = function() {
    var baseName = base_currency_INPUT.value || 'ETH'
    var baseCoin = nameToSymbol[baseName]
    base = baseCoin.Symbol

    var quoteSymbol = quote_currency_INPUT.options[quote_currency_INPUT.selectedIndex].value || 'USD'
    quote = quoteSymbol

    fetchCoinStats(baseCoin, quote, base)
    fetchChartData(quote, base)
}

quote_currency_INPUT.addEventListener('change', onCoinSelected)


/* Element selectors */
// initial inputs
var initial_rate_INPUT = document.getElementsByName("initial_rate_INPUT")[0]
var initial_num_coins_INPUT = document.getElementsByName("initial_num_coins_INPUT")[0]

// initial/current calculations
var current_avgrate_CALC = 0
var current_position_CALC = 0
var initial_value_CALC = 0
var current_value_CALC = 0
var initial_balance_CALC = 0

// initial/current display
var current_avgrate_DISPLAY = document.getElementById('current_avgrate_DISPLAY')
var current_position_DISPLAY = document.getElementById('current_position_DISPLAY')
var initial_value_DISPLAY = document.getElementById('initial_value_DISPLAY')
var current_value_DISPLAY = document.getElementById('current_value_DISPLAY')
var initial_balance_DISPLAY = document.getElementById('initial_balance_DISPLAY')

// target inputs
var target_position_INPUT = document.getElementsByName("target_position_INPUT")[0]
var target_investment_INPUT = document.getElementsByName("target_investment_INPUT")[0]
var target_rate_INPUT = document.getElementsByName("target_rate_INPUT")[0]

// target calculations
var target_avgrate_CALC = 0
var target_position_CALC = 0
var target_value_CALC = 0
var target_balance_CALC = 0

// target display
var target_avgrate_DISPLAY = document.getElementById('target_avgrate_DISPLAY')
var target_position_DISPLAY = document.getElementById('target_position_DISPLAY')
var target_value_DISPLAY = document.getElementById('target_value_DISPLAY')
var target_balance_DISPLAY = document.getElementById('target_balance_DISPLAY')


// Event listeners
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

var updateInitialRate = debounce(e => {
    current_avgrate_CALC = e.target.value.trim().replace(/[^\d.-]/g, '')
    current_avgrate_DISPLAY.innerHTML = `at ${current_avgrate_CALC}`
    initial_rate_INPUT.value = current_avgrate_CALC

    if (initial_balance_CALC) updateInitialStats()
})

var updateInitialBalance = debounce(e => {
    initial_balance_CALC = e.target.value.trim().replace(/[^\d.-]/g, '')
    initial_balance_DISPLAY.innerHTML = `Total holdings: ${initial_balance_CALC}`
    initial_num_coins_INPUT = initial_balance_CALC

    if (current_avgrate_CALC) updateInitialStats()
})

var updateInitialStats = () => {
    initial_value_CALC = parseFloat((current_avgrate_CALC * initial_balance_CALC).toFixed(8))
    initial_value_DISPLAY.innerHTML = `Initial value: ${initial_value_CALC} ${quote}`
}

initial_rate_INPUT.addEventListener("keyup", updateInitialRate)
initial_num_coins_INPUT.addEventListener("keyup", updateInitialBalance)

