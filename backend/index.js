require('dotenv').config()
const Koa = require('koa')
const Router = require('koa-router')

const ElasticEmail = require('./elasticemail')

let ee = new ElasticEmail(process.env.API_KEY, process.env.ACCOUNT_ID)

const app = new Koa()
const router = new Router()

router
.get('/send/:email', async ctx => {
    console.log(ctx.params.email)
    let contact = await ee.addContact(ctx.params.email)
    let email = await ee.sendEmail(ctx.params.email, 'Welcome to dca.tools!', '<h1>Welcome!</h1>')
    console.log(contact.data, email.data)
    ctx.body = 'OK'
})

app.use(router.routes())

app.listen(3300)