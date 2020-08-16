import Binance from "node-binance-api"
// const Binance = require("node-binance-api")
import nconf from "nconf"
// const nconf = require("nconf")
import { Decimal } from "decimal.js"
// const Decimal = require("decimal.js")
// const questions = require("./questions")
// import {argv} from 'yargs'
// const argv = require("yargs").argv

// https://developer.aliyun.com/mirror/npm/package/node-binance-api

nconf.env()

if (!nconf.get("APIKEY")) throw Error("APIKEY required!")
if (!nconf.get("APISECRET")) throw Error("APISECRET required!")

const binance = new Binance().options({
  APIKEY: nconf.get("APIKEY"),
  APISECRET: nconf.get("APISECRET"),
})

const main = async () => {
  try {
    // const balances = await binance.futuresBalance()
    // console.log("==> Balances")
    // console.log(balances)

    // const marketBuy = await binance.futuresMarketBuy("SNXUSDT", 1)
    // console.log(marketBuy)

    // const leverage = await binance.futuresLeverage("MKRUSDT", 3)
    // console.log(leverage)

    const account = await binance.futuresAccount()
    // console.log(account)

    // closePosition: true - mean the quantity will not show in the UI
    // const stopLossOrder = await binance.futuresOrder("SELL", "SNXUSDT", 86, false, { type: "STOP_MARKET", stopPrice: 6.5, closePosition: true })
    // const stopLossOrder = await binance.futuresOrder("SELL", "SNXUSDT", 86, false, { type: "STOP_MARKET", stopPrice: 6.5 })
    // console.log(stopLossOrder)

    const properties = [
      "totalInitialMargin",
      "totalMaintMargin",
      "totalWalletBalance",
      "totalUnrealizedProfit",
      "totalMarginBalance",
      "totalPositionInitialMargin",
      "totalOpenOrderInitialMargin",
      "totalCrossWalletBalance",
      "totalCrossUnPnl",
      "availableBalance",
      "maxWithdrawAmount",
    ]

    for (const prop of properties) {
      console.log(`${prop}: ${parseFloat(account[prop])}`)
    }

    const assetUsdt = account.assets.filter((item: any) => item.asset === "USDT")
    // const positions = account.positions.filter((item: any) => parseFloat(item.initialMargin) > 0)
    // .map((item: any) => {
    // return { symbol: item.symbol, unrealizedProfit: item.unrealizedProfit }
    // })
    console.log("==> USDT")
    console.log(assetUsdt)
    // console.log("==> Positions")
    // console.log(positions)

    const positionsRisk = await binance.futuresPositionRisk()
    // console.log(positionsRisk)
    const positions = positionsRisk.filter((item: any) => parseFloat(item.positionAmt) > 0)
    // console.log(positions)
    const positionsRiskSummary = positions.map((item: any) => {
      return {
        symbol: item.symbol,
        entryTotal: new Decimal(item.positionAmt).mul(item.entryPrice),
        markTotal: new Decimal(item.positionAmt).mul(item.markPrice),
        pnL: new Decimal(item.unRealizedProfit),
      }
    })
    console.log(positionsRiskSummary)
    // const positions
  } catch (e) {
    console.log("Error:", e.body)
    console.log(e)
  } finally {
    return "Done."
  }
}

main()
  .then((res) => console.log(res))
  .catch((err) => console.log(err))
