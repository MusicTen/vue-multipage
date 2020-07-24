/* eslint-disable no-undef */
// import * as PIXI from 'pixi.js'
import { Sprite, Application, AnimatedSprite, Loader, utils, Text, Container } from 'pixi.js-legacy'
// let { Sprite, Application, AnimatedSprite, Loader, utils, Text, Container } = PIXI

const width = window.innerWidth
const height = window.innerHeight
const devicePixelRatio = window.devicePixelRatio || 1
const ICON_NUM = 50
let shared = Loader.shared

class PixiApp {
  movieClips = []
  downList = []
  app
  props
  // eslint-disable-next-line no-unused-vars
  constructor(options) {
    console.log(options)
    this.props = options || []
    let app = new Application({
      // antialias: true,
      // forceCanvas: true,
      transparent: true,
      width: width * devicePixelRatio,
      height: height * devicePixelRatio,
      resolution: devicePixelRatio
    })
    app.renderer.autoResize = true
    app.view.style.width = width + 'px'
    app.view.style.height = height + 'px'
    app.renderer.resize(width, height)
    app.ticker.add(delta => this.gameLoop(delta))
    this.app = app
    this.init()
  }
  init() {
    this.loadFrameAnimateData()
    this.loadRes()
  }
  removeApp() {
    this.app.destroy()
    // shared.destroy()
    shared.resources = {}
  }
  // 加载彩带资源
  resArr = [
    { name: 'ribbon1', url: require('@/assets/img/ani/ribbon1.png') },
    { name: 'ribbon2', url: require('@/assets/img/ani/ribbon2.png') },
    { name: 'ribbon3', url: require('@/assets/img/ani/ribbon3.png') },
    { name: 'ribbon4', url: require('@/assets/img/ani/ribbon4.png') },
    { name: 'ribbon5', url: require('@/assets/img/ani/ribbon5.png') }
  ]
  loadRes() {
    shared.add(this.resArr).load(this.setup.bind(this))
  }
  setup() {
    utils.clearTextureCache()
    for (let i = 0; i <= ICON_NUM; i++) {
      let random = Math.ceil(Math.random() * this.resArr.length)
      let imgUrl = 'ribbon' + random
      let img = new Sprite(shared.resources[imgUrl].texture)
      img.scale.set(0.7)
      this.app.stage.addChild(img)
      this.ribbonInit(img)
      this.downList.push(img)
    }
  }
  createBubble(resources, { id, num }) {
    let halo = this.createHalo(resources)
    let bubble = new Sprite(resources['bubble'].texture)
    let prop = new Sprite(resources[id].texture)
    // new TextStyle()
    let text = new Text(`x${num}`, {
      fill: '#F03E6B',
      strokeThickness: 5,
      fontSize: 32,
      fontWeight: 'bold',
      stroke: '#FFFFFF'
    })
    text.x = bubble.width - 30
    text.y = bubble.height - 50
    this.centerChildren(bubble, prop)
    this.centerChildren(bubble, halo)
    bubble.addChild(text)
    return bubble
  }
  ribbonInit(img) {
    img.vx = 5
    img.vy = 5
    img.anchor.set(0.5)
    img.alpha = 0
    img.x = Math.random() * width
    img.y = -Math.random() * 1000
    img.visible = false
    img.closed = false
  }
  gameLoop() {
    let data = this.downList
    data.forEach(item => {
      if (!item.closed) {
        item.visible = true
        item.alpha += 0.01
      }
      item.y += item.vy
      let random = Math.random()
      if (item.y >= 0) item.rotation += 0.04

      if (!item.hideY) {
        let hh = height * (2 / 3)
        let hideY = random * hh
        if (hideY < 100) hideY = 200
        if (hideY > hh) hideY = hh
        item.hideY = hideY
      }

      if (item.y > item.hideY && item.alpha > 0) {
        item.closed = true
        item.alpha -= 0.1
        if (item.alpha == 0) item.visible = false
      }

      if (item.closed && item.alpha <= 0 && item.parent) {
        // this.ribbonInit(item)
        item.parent.removeChild(item)
      }
    })
  }
  createTitle(resources) {
    let title = new Sprite(resources['title'].texture)
    title.scale.set(0.5)
    title.x = (width - title.width) >> 1
    title.y = (height >> 1) - 200
    this.app.stage.addChildAt(title, 0)
  }
  loadFrameAnimateData() {
    // 加载帧动画资源
    const res = [
      {
        name: 'bubble',
        url: require('@/assets/img/ani/bubble.png')
      },
      {
        name: 'title',
        url: require('@/assets/img/turntable/title2.png')
      },
      {
        name: '2',
        url: require('@/assets/img/turntable/icon_2.png')
      },
      {
        name: '5',
        url: require('@/assets/img/turntable/icon_5.png')
      },
      {
        name: '6',
        url: require('@/assets/img/turntable/icon_6.png')
      },
      {
        name: '103',
        url: require('@/assets/img/turntable/icon_103.png')
      },
      {
        name: 'gold',
        url: require('@/assets/img/turntable/icon_gold.png')
      },
      {
        name: 'ticket',
        url: require('@/assets/img/turntable/icon_ticket.png')
      }
    ]
    const GAP = this.props.length > 3 ? 10 : 30
    // const { width: stageWidth, height: stageHeight } = this.app.renderer
    let loader = new Loader()
    loader
      .add('circle', require('./circle.json'))
      .add(res)
      .load((loader, resources) => {
        utils.clearTextureCache()
        console.log(123, resources)
        this.createTitle(resources)
        let container = new Container()
        let distance = 0
        this.props.forEach((item, idx) => {
          const bubble = this.createBubble(resources, item)
          bubble.scale.set(0.5)
          const W = bubble.width + GAP
          bubble.x = W * idx
          container.addChild(bubble)
          distance += W
          // console.log(bubble.x)
          // console.log(container.width, container.x)
        })
        this.app.stage.addChildAt(container, 0)
        container.y = (height >> 1) - 70
        container.x = (width - distance + GAP) / 2
      })
  }
  centerChildren(parent, child) {
    // child.anchor.set(0.5)
    child.x = (parent.width - child.width) / 2
    child.y = (parent.height - child.height) / 2
    parent.addChild(child)
  }
  createHalo(resources, name = 'circle') {
    console.log(resources['circle'])
    let sheet = resources[name].spritesheet
    console.log(sheet)
    let movieClip = new AnimatedSprite(sheet.animations[name])
    this.app.stage.addChild(movieClip)
    movieClip.play()
    movieClip.loop = false
    movieClip.scale.set(2)
    return movieClip
  }
}

export default PixiApp
