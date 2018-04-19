var coins = []
var coinNames = []
var nameToSymbol = {}

var quote = 'USD'
var base = 'BTC'
var currentData = {}

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
        base = coin.Symbol
        var quote_select = document.getElementById("quote_currency");
        quote = quote_select.options[quote_select.selectedIndex].value;

        fetchCoinStats(coin, quote, base)
        fetchChartData(quote, base)
    }
})


var fetchCoinStats = function(coin, quote, base) {
    quote = this.quote.toUpperCase()
    base = this.base.toUpperCase()
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
        currentData = {
            icon: coin.ImageUrl,
            price: { raw: raw.PRICE, display: display.PRICE },
            price24hrChange: { raw: raw.CHANGEPCT24HOUR, display: display.CHANGEPCT24HOUR },
            volume24hr: { raw: raw.VOLUME24HOURTO, display: display.VOLUME24HOURTO },
            marketCap: { raw: raw.MKTCAP, display: display.MKTCAP }
        }

        target_rate_INPUT.value = currentData.price.raw
        if (current_avgrate_CALC && initial_balance_CALC) updateInitialStats()

        console.log(currentData)
    })
}

var quote_select = document.getElementById("quote_currency");
quote_select.addEventListener('change', function(e) {
    quote = e.target.value
    document.querySelectorAll('.tip.quote').forEach(function(tip) {
        tip.innerHTML = quote.toUpperCase()
    })
})


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

function sanitize(input) {
    return parseFloat(input.trim().replace(/[^\d.-]/g, '')) || 0
}

// Initials
var updateInitialRate = debounce(function(e) {
    current_avgrate_CALC = sanitize(e.target.value)
    current_avgrate_DISPLAY.innerHTML = `at ${current_avgrate_CALC }`
    initial_rate_INPUT.value = current_avgrate_CALC

    if (initial_balance_CALC) updateInitialStats()
})

var updateInitialBalance = debounce(function(e) {
    initial_balance_CALC = sanitize(e.target.value)
    initial_balance_DISPLAY.innerHTML = `Total holdings: ${initial_balance_CALC} ${base.toUpperCase()}`
    initial_num_coins_INPUT.value = initial_balance_CALC

    if (current_avgrate_CALC) updateInitialStats()
})

function updateInitialStats() {
    initial_value_CALC = current_avgrate_CALC * initial_balance_CALC
    initial_value_DISPLAY.innerHTML = `Initial value: ${parseFloat(initial_value_CALC.toFixed(8))} ${quote.toUpperCase()}`

    if (currentData.price) {
        current_value_CALC = currentData.price.raw * initial_balance_CALC
        current_value_DISPLAY.innerHTML = `Current value: ${parseFloat(current_value_CALC.toFixed(8))} ${quote.toUpperCase()}`

        current_position_CALC = initial_value_CALC ? (current_value_CALC - initial_value_CALC) / initial_value_CALC * 100 : 0
        current_position_DISPLAY.innerHTML = `${current_position_CALC.toFixed(2)}%`
    }
}

initial_rate_INPUT.addEventListener("keyup", updateInitialRate)
initial_num_coins_INPUT.addEventListener("keyup", updateInitialBalance)


// Targets
var updateTargetPosition = debounce(function(e) {
    target_position_CALC = sanitize(e.target.value)
    target_position_DISPLAY.innerHTML = `${target_position_CALC.toFixed(2)}%`
    target_position_INPUT.value = target_position_CALC
})

var updateTargetRate = debounce(function(e) {
    target_avgrate_CALC = sanitize(e.target.value)
    target_rate_INPUT.value = target_avgrate_CALC
})

var updateTargetInvestment = debounce(function(e) {
    target_value_CALC = sanitize(e.target.value)
    target_value_DISPLAY.innerHTML = `Target value: ${target_value_CALC + initial_value_CALC} ${quote.toUpperCase()}`
    target_investment_INPUT.value = target_value_CALC
})

function updateTargetStats() {

}

target_position_INPUT.addEventListener("keyup", updateTargetPosition)
target_rate_INPUT.addEventListener("keyup", updateTargetRate)
target_investment_INPUT.addEventListener("keyup", updateTargetInvestment)

