require('dotenv').config()
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const ElasticEmail = require('./elasticemail')
const emailMaker = require('./email')

let ee = new ElasticEmail(process.env.API_KEY, process.env.ACCOUNT_ID)

const app = new Koa()
const router = new Router()

router
.post('/api/send', async ctx => {
    let data = ctx.request.body.exportData
    // let contact = await ee.addContact(ctx.params.email)
    let email = await ee.sendEmail(ctx.request.body.email, "Your dca.tools calculations:", emailMaker(data))

    ctx.body = 'OK'
})

app
.use(bodyParser())
.use(router.routes())
.listen(3300)