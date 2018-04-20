var coins = []
var coinNames = []
var nameToSymbol = {}

var quote = 'USD'
var base = 'ETH'
var currentData = {}

var tableRows = []

var defaultCoin = 'Ethereum (ETH)'

// currency inputs
var quote_currency_INPUT = document.getElementById("quote_currency_INPUT")
var base_currency_INPUT = document.getElementById("base_currency_INPUT")

// above chart stats
var coin_icon_DISPLAY = document.getElementById('coin_icon_DISPLAY')
var coin_rate_DISPLAY = document.getElementById('coin_rate_DISPLAY')
var coin_rate_ch_DISPLAY = document.getElementById('coin_rate_ch_DISPLAY')
var coin_vol_DISPLAY = document.getElementById('coin_vol_DISPLAY')
var coin_mkcap_DISPLAY = document.getElementById('coin_mkcap_DISPLAY')

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

    onCoinSelected()
    base_currency_INPUT.value = defaultCoin
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
        updateCoinStats()

        console.log(currentData)
    })
}

var onCoinSelected = function() {
    var baseName = base_currency_INPUT.value && base_currency_INPUT.value.length > 0 ? base_currency_INPUT.value : defaultCoin
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


// Export modal stuff
var modal = document.getElementById('export-modal')

function closeModal() {
    modal.style.display = "none"
}
function openModal() {
    modal.style.display = "block"
}

document.querySelectorAll('.close-export-modal').forEach(function(e) {
    e.addEventListener('click', closeModal)
})
document.querySelectorAll('.open-export-modal').forEach(function(e) {
    e.addEventListener('click', openModal)
})
document.getElementById('send-export').addEventListener('click', function(e) {
    var email = document.getElementsByName("export_email")[0].value
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    re.test(String(email).toLowerCase())

    if (re.test(String(email).toLowerCase())) {
        document.getElementById('invalid-email').style.display = 'none'
        document.getElementById('step1').style.display = 'none'
        document.getElementById('step2').style.display = 'block'
    } else {
        document.getElementById('invalid-email').style.display = 'block'
    }
})


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

var past_calculations_table = document.getElementById('past_calculations_table')


// Event listeners
function sanitize(input) {
    return parseFloat(input.trim().replace(/[^\d.-]/g, '')) || 0
}

// Initials
var updateInitialRate = function(e) {
    initial_rate_CALC = sanitize(e.target.value)
    updateInitialStats()
    updateTargetStats()
}

var updateInitialBalance = function(e) {
    initial_num_coins_CALC = sanitize(e.target.value)
    updateInitialStats()
    updateTargetStats()
}

function updateInitialStats() {
    initial_rate_DISPLAY.innerHTML = `avg. price ${initial_rate_CALC} ${quote.toUpperCase()}`
    initial_num_coins_DISPLAY.innerHTML = `Total holdings: ${initial_num_coins_CALC} ${base.toUpperCase()}`

    initial_value_CALC = initial_rate_CALC * initial_num_coins_CALC
    initial_value_DISPLAY.innerHTML = `Initial investment: ${parseFloat(initial_value_CALC.toFixed(8))} ${quote.toUpperCase()}`

    if (currentData.price) {
        current_position_CALC = initial_rate_CALC ? (currentData.price.raw - initial_rate_CALC) / initial_rate_CALC * 100 : 0
        current_position_DISPLAY.innerHTML = `${current_position_CALC.toFixed(2)}%`
        current_position_DISPLAY.className = `profit ${current_position_CALC >= 0 ? 'green' : 'red'}`
    
        current_value_CALC = currentData.price.raw * initial_num_coins_CALC
        current_value_DISPLAY.innerHTML = `Current value: ${parseFloat(current_value_CALC.toFixed(8))} ${quote.toUpperCase()}`
    }
}

initial_rate_INPUT.addEventListener("keyup", updateInitialRate)
initial_num_coins_INPUT.addEventListener("keyup", updateInitialBalance)


// Targets
var updateTargetPosition = function(e) {
    target_position_CALC = sanitize(e.target.value)
    updateInitialStats()
    updateTargetStats('position')
}

var updateTargetRate = function(e) {
    target_rate_CALC = sanitize(e.target.value)
    updateInitialStats()
    updateTargetStats()
}

var updateTargetInvestment = function(e) {
    target_value_CALC = sanitize(e.target.value)
    updateInitialStats()
    updateTargetStats('investment')
}

function updateInvestment() {
    target_num_coins_CALC = initial_num_coins_CALC + target_value_CALC / target_rate_CALC 
    target_avgrate_CALC = (initial_rate_CALC * initial_num_coins_CALC / target_num_coins_CALC) + (target_rate_CALC * (target_num_coins_CALC - initial_num_coins_CALC) / target_num_coins_CALC)
    target_position_CALC = (target_rate_CALC - target_avgrate_CALC) / target_avgrate_CALC * 100
    
    target_position_INPUT.value = target_position_CALC.toFixed(2)
}
function updatePosition() {
    target_avgrate_CALC = target_rate_CALC - target_rate_CALC * target_position_CALC / 100
    target_num_coins_CALC = initial_num_coins_CALC * (initial_rate_CALC - target_rate_CALC) / (target_avgrate_CALC - target_rate_CALC)
    target_value_CALC = target_num_coins_CALC * target_avgrate_CALC - initial_value_CALC
    
    target_investment_INPUT.value = parseFloat((target_value_CALC).toFixed(8))
}

function updateTargetStats(type = 'rate') {
    if (type == 'rate') {
        if (target_value_CALC) updateInvestment()
        else if (target_position_CALC) updatePosition()
    }
    else if (type == 'investment') updateInvestment()
    else updatePosition()
    
    target_avgrate_DISPLAY.innerHTML = `avg. price ${target_avgrate_CALC.toFixed(8)} ${quote.toUpperCase()}`

    // update displays
    target_position_DISPLAY.innerHTML = `${target_position_CALC.toFixed(2)}%`
    target_position_DISPLAY.className = `profit ${target_position_CALC >= 0 ? 'green' : 'red'}`
    target_value_DISPLAY.innerHTML = `Target investment: ${parseFloat((target_value_CALC + initial_value_CALC).toFixed(8))} ${quote.toUpperCase()}`
    target_num_coins_DISPLAY.innerHTML = `Target holdings: ${parseFloat(target_num_coins_CALC.toFixed(8))} ${base.toUpperCase()}`
}

function updateCoinStats() {
    coin_icon_DISPLAY.innerHTML = `<img src="https://www.cryptocompare.com${currentData.icon}" />`
    coin_rate_DISPLAY.innerHTML = currentData.price.display
    var pctChg = currentData.price24hrChange.raw
    coin_rate_ch_DISPLAY.innerHTML = (pctChg >= 0 ? '&#x25B2;' : '&#x25BC;') + ' ' + pctChg.toFixed(2) + "%"
    coin_rate_ch_DISPLAY.className = `coin-stats-subtitle ${pctChg >= 0 ? 'green' : 'red'}`
    coin_vol_DISPLAY.innerHTML = currentData.volume24hr.display
    coin_mkcap_DISPLAY.innerHTML = currentData.marketCap.display
}

function addToTable() {
    var pair = quote.toUpperCase() + "-" + base.toUpperCase()
    var initialRate = initial_rate_INPUT.value.length > 0 ? parseFloat(initial_rate_INPUT.value) : null
    var initialBalance = initial_num_coins_INPUT.value.length > 0 ? parseFloat(initial_num_coins_INPUT.value) : null
    var targetNumCoins = target_num_coins_CALC ? (target_num_coins_CALC - initialBalance) : null
    var targetRate = target_rate_CALC || null
    var targetPosition = target_position_CALC

    tableRows.push([pair, initialRate, initialBalance, targetRate, targetNumCoins, targetPosition])

    renderTable()
}

function renderTable() {
    var tableHtml = "<tr><th>Pair</th><th>Initial rate</th><th>Initial balance</th><th>Rate to buy at</th><th>Amount to buy</th><th>Target position</th></tr>"
    tableHtml += tableRows.reduce(function(res, row) {
        if (row.every(function(r) { return r })) {
            res += `
                <tr>
                  <td>${row[0]}</td>
                  <td>${row[1].toFixed(8)}</td>
                  <td>${row[2].toFixed(8)}</td>
                  <td>${row[3].toFixed(8)}</td>
                  <td>${row[4].toFixed(8)}</td>
                  <td><strong>${row[5].toFixed(2)}%</strong></td>
                </tr>
            `
            return res
        } else return res
    }, "")

    past_calculations_table.innerHTML = tableHtml
}

target_investment_INPUT.addEventListener("keyup", updateTargetInvestment)
target_rate_INPUT.addEventListener("keyup", updateTargetRate)
target_position_INPUT.addEventListener("keyup", updateTargetPosition)
document.getElementById("add_to_table").addEventListener("click", addToTable)
