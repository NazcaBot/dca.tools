var coins = []

// Get available markets
axios.get("https://min-api.cryptocompare.com/data/all/coinlist")
.then(function(res) {
    var res = res.data.Data

    for (m in res) {
        coins.push(res[m].FullName)
    }
})


var demo = new autoComplete({
    selector: '#base_currency',
    minChars: 1,
    source: function(term, suggest){
        term = term.toLowerCase();
        var choices = coins
        var suggestions = [];
        for (i=0;i<choices.length;i++)
            if (~choices[i].toLowerCase().indexOf(term)) suggestions.push(choices[i]);
        suggest(suggestions);
    },
    onSelect: function(e, term, item) {
        console.log(term, item)
    }
})


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
