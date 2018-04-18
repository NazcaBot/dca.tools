var markets = {}

// Element selectors
var marketSelect = document.getElementsByName('base_currency')[0]

// Get available markets
axios.get("https://min-api.cryptocompare.com/data/all/coinlist")
.then(function(res) {
    var markets = res.data.Data

    for (m in markets) {
        var option = document.createElement("option");
        option.text = markets[m].FullName
        option.value = markets[m].Symbol
        marketSelect.appendChild(option)
    }
})
