import { ethers, providers } from 'ethers'
import { ElMessageBox } from 'element-plus'

const mode = import.meta.env.MODE
// const limitChain = mode === 'production' ? [80001, 210425, 1284, 137] : [80001]
const limitChain = [80001, 210425, 1284, 137]
// const net = mode === 'production' ? 'Polygon/Platon/Mumbai' : 'Mumbai'
const net = 'Polygon/Platon/Moonbeam/Mumbai'
const scanMap: any = {
  137: 'https://polygonscan.com/tx/',
  1284: 'https://moonbeam.moonscan.io/tx/',
  210425: 'https://scan.platon.network/trade-detail?txHash=',

  80001: 'https://mumbai.polygonscan.com/tx/'
}

// 浏览器环境
export const os = (function () {
  var ua = navigator.userAgent,
    isWindowsPhone = /(?:Windows Phone)/.test(ua),
    isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
    isAndroid = /(?:Android)/.test(ua),
    isFireFox = /(?:Firefox)/.test(ua),
    isChrome = /(?:Chrome|CriOS)/.test(ua),
    isTablet =
      /(?:iPad|PlayBook)/.test(ua) ||
      (isAndroid && !/(?:Mobile)/.test(ua)) ||
      (isFireFox && /(?:Tablet)/.test(ua)),
    isIos = /\(i[^;]+;( U;)? CPU.+Mac OS X/.test(ua) && !isTablet,
    isPhone = /(?:iPhone)/.test(ua) && !isTablet,
    isPc = !isPhone && !isAndroid && !isSymbian && !isTablet

  return {
    isIos: isIos,
    isAndroid: isAndroid,
    isPc: isPc
  }
})()

export const logErr = (err: any) => {
  if (typeof err === 'string') return console.log(err)
  const keys = Object.keys(err)
  if (!keys.length) return console.log(err)
  keys.map((k: any) => {
    let info = err[k]
    try {
      info = JSON.stringify(err[k])
    } catch (error) {}
    console.log(`${k}::${info}`)
  })
}

export const cutString = (s?: string, hLen = 6, fLen = 6) => {
  if (!s) return ''
  return s.substring(0, hLen) + '......' + s.substring(s.length - fLen)
}

export const handleMintErr = (err: any) => {
  console.log(
    '%c [ err ]-5',
    'font-size:13px; background:pink; color:#bf2c9f;',
    err
  )
  if (err.code) {
    if (err.code === 'ACTION_REJECTED') return

    let msg = err.desc || err.reason || err.message
    
    if (msg.includes('Internal JSON-RPC error') && err?.data?.message) {
      msg = err?.data?.message
    }

    return ElMessage.info(msg)
  }

  ElMessage.info(
    'Wallet unknown error, please restart your browser and try again'
  )
}

// t 秒数
export const calcCountDown = (t: number) => {
  if (t < 0 || !+t) {
    return { days: '0', hh: '00', mm: '00', ss: '00' }
  }
  const days = Math.floor(t / (3600 * 24)) || 0
  const oneday = t - days * 24 * 3600
  const h = Math.floor(oneday / 3600)
  const hh = `${h > 9 ? '' : '0'}${h}`
  const m = Math.floor((oneday - h * 3600) / 60)
  const mm = `${m > 9 ? '' : '0'}${m}`
  const s = oneday - h * 3600 - m * 60
  const ss = `${s > 9 ? '' : '0'}${s}`
  return { days, hh, mm, ss }
}
