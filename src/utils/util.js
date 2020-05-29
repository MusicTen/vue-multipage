export function query(query, url) {
  // query = query.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]')
  const _query = query.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
  var expr = '[\\?&]' + _query + '=([^&#]*)'
  var regex = new RegExp(expr)
  const _url = url || window.location.href
  var results = regex.exec(_url)
  if (results !== null) {
    return decodeURIComponent(results[1].replace(/\+/g, ' '))
  } else {
    return ''
  }
}

export function formatTimestamp(e) {
  var t = new Date(1e3 * e)
  var i = t.getFullYear()
  var n = t.getMonth() + 1 < 10 ? '0' + (t.getMonth() + 1) : t.getMonth() + 1
  var o = t.getDate() < 10 ? '0' + t.getDate() : t.getDate()
  return i + '-' + n + '-' + o
}

//福气值计算
export function getFormatFortune(value = 0) {
  let str = value.toString()
  // let len = str.length;
  value = parseFloat(str)
  if (value < 10000) {
    return str
  }
  if (value < Math.pow(10, 6)) {
    let val = (value / 1000).toFixed(2)
    return val + 'k'
  }
  if (value < Math.pow(10, 9)) {
    //保留两位
    let val = (value / 1000000).toFixed(2)
    return val + 'm'
  }
  if (value < Math.pow(10, 12)) {
    let val = (value / Math.pow(10, 9)).toFixed(2)
    return val + 'b'
  }
  if (value < Math.pow(10, 15)) {
    let val = (value / Math.pow(10, 12)).toFixed(2)
    return val + 't'
  }
  if (value < Math.pow(10, 18)) {
    let val = (value / Math.pow(10, 15)).toFixed(1)
    return val + 'aa'
  }
  if (value < Math.pow(10, 21)) {
    let val = (value / Math.pow(10, 18)).toFixed(1)
    return val + 'bb'
  }
  if (value < Math.pow(10, 24)) {
    let val = (value / Math.pow(10, 21)).toFixed(1)
    return val + 'cc'
  }
  if (value < Math.pow(10, 27)) {
    let val = (value / Math.pow(10, 24)).toFixed(1)
    return val + 'dd'
  }
  if (value < Math.pow(10, 30)) {
    let val = (value / Math.pow(10, 27)).toFixed(1)
    return val + 'ee'
  }
  if (value < Math.pow(10, 33)) {
    let val = (value / Math.pow(10, 30)).toFixed(1)
    return val + 'ff'
  }
  if (value < Math.pow(10, 36)) {
    let val = (value / Math.pow(10, 33)).toFixed(1)
    return val + 'gg'
  }
  return '9999gg'
}
/**
 * 节流
 */
export function throttle(fn, wait = 2000) {
  let _lastTime = null
  return function() {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > wait || !_lastTime) {
      fn.apply(this, arguments)
      _lastTime = _nowTime
    }
  }
}
