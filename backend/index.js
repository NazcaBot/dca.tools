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
.post('/send', async ctx => {
    let data = ctx.request.body.exportData
    console.log(data)
    if (data && data.length > 0)
        let email = await ee.sendEmail(ctx.request.body.email, "Your dca.tools calculations:", emailMaker(data))
    // let contact = await ee.addContact(ctx.params.email)

    ctx.body = 'OK'
})

router.get('/test', async ctx => {
    ctx.body = 'tested!'
})

app
.use(bodyParser())
.use(router.routes())
.listen(3300)