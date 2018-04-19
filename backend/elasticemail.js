const axios = require('axios')
const querystring = require('querystring')

class ElasticEmail {
    constructor(apikey, accountid) {
        this.base = "https://api.elasticemail.com/v2"
        this.apikey = apikey
        this.accountid = accountid
    }

    addContact(email) {
        console.log(querystring.stringify({
            // apikey: this.apikey,
            publicAccountID: this.accountid,

            email: email,
            sendActivation: false
        }))
        return axios.get(`${this.base}/contact/add`, querystring.stringify({
            // apikey: this.apikey,
            publicAccountID: this.accountid,

            email: email,
            sendActivation: false
        }))
    }

    sendEmail(to, subject, body, isTransactional = true) {
        console.log({
            apikey: this.apikey,
            from: "toolsdca@gmail.com",
            fromName: "DCA.tools",
            subject: subject,
            to: to,
            bodyHtml: body,
            isTransactional: isTransactional
        })
        return axios.post(`${this.base}/email/send`, querystring.stringify({
            apikey: this.apikey,
            from: "toolsdca@gmail.com",
            fromName: "DCA.tools",
            subject: subject,
            to: to,
            bodyHtml: body,
            isTransactional: isTransactional
        }))
    }
}

module.exports = ElasticEmail