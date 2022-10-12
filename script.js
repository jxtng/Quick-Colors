'use strict'
class FlashColors {
  constructor() {
    // ---------- Properties ----------
    this.root = document.documentElement
    this.main = document.querySelector('main')
    this.color_container = document.querySelector('#color_container')
    this.info = document.querySelector('#info')
    this.speed = document.querySelector('#speed').value*1000 || 1000
    this.maximize = document.querySelector('#maximize')
    this.play_pause = document.querySelector('#play_pause')
    this.colors = {}, this.index = 0
    // ---------- Methods ----------
    this.addColorElement(); this.addColorElement()
    this.root.addEventListener('click', this.clickEvents.bind(this))
    this.root.addEventListener('change', this.changeEvents.bind(this))
    this.root.addEventListener('mouseover', this.hoverEvents.bind(this))
    this.start()
  }

  // ---------- (Dynamic) Events ----------
  clickEvents(event) {
    let e = event.target
    if(e.matches('.del')) { delete this.colors[e.parentElement.dataset.id]; e.parentElement.remove(); this.toggleDels() }
    if(e.matches('#add')) { this.addColorElement() }
    if(e.matches('#play_pause')) { this.tick ? this.stop() : this.start() }
    if(e.matches('.color-name')) { this.updateColor(e.parentElement, this.convertToHex(prompt('Enter Hex/RGB/HSl color value',e.textContent))) }
    if(e.matches('#random')) { this.color_container.querySelectorAll('.color-group').forEach(el => this.updateColor(el, this.rand('ABCDEF1234567890',6,'#'))) }
    if(e.matches('#minimize')) { this.toggleDialogue(false) }
    if(e.matches('#maximize')) { this.toggleDialogue() }
  }
  changeEvents(event) {
    let e = event.target
    if(e.matches('input[name=col]')) { this.updateColor(e.parentElement, e.value) }
    if(e.matches('#speed')) { this.speed = isNaN(e.value) ? 1000 : e.value*1000; this.tick ? this.start(true) : this.stop(); }
  }
  hoverEvents(event) {
    let e = event.target
    if(e.title) { this.info.textContent = e.title }
    else e.title = 'Click on start/stop to toggle flash'
  }
  // ---------- (Dynamic) Events ----------
  
  // ---------- Utils ----------
  createElement(name, attrs) {
    let el = document.createElement(name)
    for(let i in attrs) {
      el[i] === undefined ? el.setAttribute(i.replace('_','class'), attrs[i]) : el[i]=attrs[i]
    }
    return el
  }
  rand(str, len=8, res='') {
    while(len > 0) { res+=str[Math.floor(Math.random() * str.length)]; len-- }
    return res
  }
  convertToHex(color) {
    return color
  }
  // ---------- Utils ----------
  
  // ---------- Ticking ----------
  start(force=false) {
    if(force) this.stop()
    if(this.tick){ console.log('Already ticking...') }
    else { this.tick = setInterval( this.changeBg.bind(this), this.speed) } 
    this.togglePlayPause()
  }
  stop() {
    clearInterval(this.tick)
    this.tick = null
    this.togglePlayPause()
  }
  // ---------- Ticking ----------
  
  // ---------- Toggles ----------
  togglePlayPause() {
    if(this.tick) { this.play_pause.dataset.state = 'paused'; this.play_pause.textContent = 'Pause' }
    else { this.play_pause.dataset.state = 'playing'; this.play_pause.textContent = 'Play' }
  }
  toggleDels() {
    let dels = this.color_container.querySelectorAll('.del')
    if(this.color_container.children.length > 2) dels.forEach(d => {d.style.display = 'block'})
    else dels.forEach(d => {d.style.display = 'none'})
  }
  toggleDialogue(show=true) {
    if(show) {
      this.main.style.transform = 'translate(0, 0) scale(1)'
      this.maximize.style.transform = 'scale(0)'
    }else{
      this.main.style.transform = 'translate(100%, -100%) scale(0)'
      this.maximize.style.transform = 'scale(1)'
    }
  }
  // ---------- Toggles ----------
  
  // ---------- Manipulate Elements ----------
  addColorElement() {
    let col = this.rand('ABCDEF123456789',6,'#'), id = this.rand('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',8,'ID')
    const div = this.createElement('div', {_:'color-group', style:`--col:${col};` , 'data-id':id})
    const input = this.createElement('input', {type:'color', name:'col', value:col, title:'Click to select color'})
    const col_name = this.createElement('span', { textContent:col, _:'color-name', title:'Click to edit'})
    const del = this.createElement('button', {_:'del', title:'Delete this color entry'})
    div.append(input, col_name, del); this.color_container.append(div); this.colors[id] = col
    this.toggleDels()
  }
  changeBg() {
    let colors = Object.values(this.colors)
    this.root.style.setProperty('--flashes', colors[this.index])
    this.index = this.index < colors.length-1 ? this.index+1 : 0
  }
  updateColor(group, color) {
    this.colors[group.dataset.id] = color.toUpperCase()
    group.children[0].value = color.toUpperCase()
    group.children[1].textContent = color.toUpperCase()
    group.style.setProperty('--col',color.toUpperCase())
  }
  // ---------- Manipulate Elements ----------
}

const flash = new FlashColors()
