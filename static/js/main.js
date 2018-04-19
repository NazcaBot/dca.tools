var coins = []
var coinNames = []
var nameToSymbol = {}

var quote = 'USD'
var base = 'ETH'
var currentData = {}

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

        target_rate_CALC = currentData.price.raw
        target_rate_INPUT.value = target_rate_CALC
        updateInitialStats()
        updateTargetStats()

        console.log(currentData)
    })
}

var onCoinSelected = function() {
    var baseName = base_currency_INPUT.value || 'ETH'
    var baseCoin = nameToSymbol[baseName]
    base = baseCoin.Symbol

    var quoteSymbol = quote_currency_INPUT.options[quote_currency_INPUT.selectedIndex].value || 'USD'
    quote = quoteSymbol
    
    document.querySelectorAll('.tip.quote').forEach(function(tip) {
        tip.innerHTML = quote.toUpperCase()
    })

    fetchCoinStats(baseCoin, quote, base)
    fetchChartData(quote, base)
}

quote_currency_INPUT.addEventListener('change', onCoinSelected)


/* Element selectors */
// initial inputs
var initial_rate_INPUT = document.getElementsByName("initial_rate_INPUT")[0]
var initial_num_coins_INPUT = document.getElementsByName("initial_num_coins_INPUT")[0]

// initial/current calculations
var initial_rate_CALC = 0
var current_position_CALC = 0
var initial_value_CALC = 0
var current_value_CALC = 0
var initial_num_coins_CALC = 0

// initial/current display
var initial_rate_DISPLAY = document.getElementById('initial_rate_DISPLAY')
var current_position_DISPLAY = document.getElementById('current_position_DISPLAY')
var initial_value_DISPLAY = document.getElementById('initial_value_DISPLAY')
var current_value_DISPLAY = document.getElementById('current_value_DISPLAY')
var initial_num_coins_DISPLAY = document.getElementById('initial_num_coins_DISPLAY')

// target inputs
var target_position_INPUT = document.getElementsByName("target_position_INPUT")[0]
var target_investment_INPUT = document.getElementsByName("target_investment_INPUT")[0]
var target_rate_INPUT = document.getElementsByName("target_rate_INPUT")[0]

// target calculations
var target_rate_CALC = 0
var target_avgrate_CALC = 0
var target_position_CALC = 0
var target_value_CALC = 0
var target_num_coins_CALC = 0

// target display
var target_avgrate_DISPLAY = document.getElementById('target_avgrate_DISPLAY')
var target_position_DISPLAY = document.getElementById('target_position_DISPLAY')
var target_value_DISPLAY = document.getElementById('target_value_DISPLAY')
var target_num_coins_DISPLAY = document.getElementById('target_num_coins_DISPLAY')


// Event listeners
function update(func) {
    return function() { 
        func.apply(this, arguments)
        updateInitialStats()
        updateTargetStats()
    }
}

function sanitize(input) {
    return parseFloat(input.trim().replace(/[^\d.-]/g, '')) || 0
}

// Initials
var updateInitialRate = update(function(e) {
    initial_rate_CALC = sanitize(e.target.value)
})

var updateInitialBalance = update(function(e) {
    initial_num_coins_CALC = sanitize(e.target.value)
})

function updateInitialStats() {
    initial_rate_DISPLAY.innerHTML = `at ${initial_rate_CALC}`
    initial_num_coins_DISPLAY.innerHTML = `Total holdings: ${initial_num_coins_CALC} ${base.toUpperCase()}`

    initial_value_CALC = initial_rate_CALC * initial_num_coins_CALC
    initial_value_DISPLAY.innerHTML = `Initial investment: ${parseFloat(initial_value_CALC.toFixed(8))} ${quote.toUpperCase()}`

    if (currentData.price) {
        current_position_CALC = initial_rate_CALC ? (currentData.price.raw - initial_rate_CALC) / initial_rate_CALC * 100 : 0
        current_position_DISPLAY.innerHTML = `${current_position_CALC.toFixed(2)}%`
    
        current_value_CALC = currentData.price.raw * initial_num_coins_CALC
        current_value_DISPLAY.innerHTML = `Current value: ${parseFloat(current_value_CALC.toFixed(8))} ${quote.toUpperCase()}`
    }
}

initial_rate_INPUT.addEventListener("keyup", updateInitialRate)
initial_num_coins_INPUT.addEventListener("keyup", updateInitialBalance)


// Targets
var updateTargetPosition = update(function(e) {
    target_position_CALC = sanitize(e.target.value)
})

var updateTargetRate = update(function(e) {
    target_rate_CALC = sanitize(e.target.value)
})

var updateTargetInvestment = update(function(e) {
    target_value_CALC = sanitize(e.target.value)
})

function updateTargetStats() {
    if (target_value_CALC) {
        target_num_coins_CALC = initial_num_coins_CALC + target_value_CALC / target_rate_CALC 
        target_avgrate_CALC = (initial_rate_CALC * initial_num_coins_CALC / target_num_coins_CALC) + (target_rate_CALC * (target_num_coins_CALC - initial_num_coins_CALC) / target_num_coins_CALC)
        target_position_CALC = (target_rate_CALC - target_avgrate_CALC) / target_avgrate_CALC * 100
    }
    else if (target_position_CALC) {
        target_avgrate_CALC = target_rate_CALC + target_rate_CALC * target_position_CALC / 100
        target_num_coins_CALC = initial_num_coins_CALC * (initial_rate_CALC - target_rate_CALC) / (target_avgrate_CALC - target_rate_CALC)
        target_value_CALC = target_num_coins_CALC * target_avgrate_CALC
    }
    // else {
    //     target_value_CALC =
    //     target_num_coins_CALC = 
    //     target_position_CALC = 
    // }
    
    target_avgrate_DISPLAY.innerHTML = `at ${target_avgrate_CALC.toFixed(8)}`
    
    target_position_INPUT.value = target_position_CALC
    // target_investment_INPUT.value = target_value_CALC - initial_value_CALC

    // update displays
    target_position_DISPLAY.innerHTML = `${target_position_CALC.toFixed(2)}%`
    target_value_DISPLAY.innerHTML = `Target investment: ${target_value_CALC + initial_value_CALC} ${quote.toUpperCase()}`
    target_num_coins_DISPLAY.innerHTML = `Target holdings: ${parseFloat(target_num_coins_CALC.toFixed(8))} ${base.toUpperCase()}`
}

target_investment_INPUT.addEventListener("keyup", updateTargetInvestment)
target_rate_INPUT.addEventListener("keyup", updateTargetRate)
target_position_INPUT.addEventListener("keyup", updateTargetPosition)

