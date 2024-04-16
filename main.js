//@ts-nocheck


var hasProp = ({}.constructor).hasOwn;
const Tag = class {
  constructor() {
    this.initVnode()
    this.render = null
    this.dom = null
    this.initParams = function() {}
    this.parent = null
  }

  initVnode() {
    let ref;return ((ref = this).vnode = {
        tagName:"div",
        attrs:{},
        params:{},
        children:[],
    },ref)
  }
        
  view(fn) {
    this.render = function() {
      this.initParams()
      return fn(this)
    }
    return this
  }
  inject(fn) {
    let oldRender = this.render
    this.render = function() {
      oldRender.call(this)
      return fn(this)
    }
    return this
  }
  param(paramFn) {
    this.initParams = function() {
      return this.vnode.params = {
        ...this.vnode.params,
        ...paramFn()
      }
    }
    return this
  }
  to(fn) {
    fn(this)
    return this
  }
  tag(name) {
    let ref1;return ((ref1 = this).vnode.tagName = name,ref1)
  }
  setParent(tag) {
    this.parent = tag
    return this
  }
  attr(attrObj) {
    if (attrObj.style) {
      throw new Error("please use style replace attr")
    }
    let ref2;((ref2 = this).vnode.attrs = {
        ...this.vnode.attrs,
        ...attrObj
      },ref2)
    return this
  }
  style(styleObj) {
    let ref3;return ((ref3 = this).vnode.attrs.style = {
        ...this.vnode.attrs.style,
        ...styleObj
      },ref3)
  }
  clone() {
    let clone = new Tag()
    clone.initParams = this.initParams
    clone.render = this.render
    clone.parent = this.parent
    clone.vnode = JSON.parse(JSON.stringify(this.vnode))
    return clone
  }


  child(tag) {
    let m;if(m = typeof tag,m === "string") {
        return this.vnode.children.push(new Tag().view($ => $.text(tag).setParent(this)))}
else  {
        if (!(tag instanceof Tag)) {
          console.error(tag)
          throw new Error("tag not instance of Tag")
        }
        return this.vnode.children.push(tag.setParent(this))
      }
  }
  text(str) {
    this.vnode.children = str
    return this
  }
  children(children) {
    if (typeof children === "string") {
      this.child(children)
    }
    else {
      for (const child of children) {
        this.child(child)
      }
    }
    return this
  }
  draw() {
    let m1;if(m1 = typeof this.vnode.children,m1 === "string") {
        this.dom ??= document.createTextNode("")
        if (this.dom) {
          let parent = this.dom.parentNode
          if (parent) {
            parent.removeChild(this.dom)
            this.dom = document.createTextNode("")
            this.dom.parentNode.appendChild(this.dom)
          }
        }
            
        if (this.vnode.attrs.oncreate) {
          this.vnode.attrs.oncreate(this.dom)
        }

        this.dom.data = this.vnode.children}
else  {
        this.dom ??= document.createElement(this.vnode.tagName)
        if (this.dom && this.dom.tagName.toLowerCase() !== this.vnode.tagName) {
          let parent = this.dom.parentNode
          if (parent) {
            parent.removeChild(this.dom) 
            this.dom = document.createElement(this.vnode.tagName)
            parent.appendChild(this.dom)
          }
        }
        this.dom.innerHTML = ""
        if (this.vnode.attrs.oncreate) {
          this.vnode.attrs.oncreate(this.dom)
        }
        
        let ref4;for (const key in ref4 = this.vnode.attrs) {
          if (!hasProp(ref4, key)) continue;
          const attr = ref4[key];
          if (key === "style") {
            for (const name in attr) {
              if (!hasProp(attr, name)) continue;
              const value = attr[name];
              this.dom.style[name] = value
            }
          }
          else {
            this.dom[key] = attr
          }
        }
        for (const child of this.vnode.children) { this.dom.appendChild(child.dom) }
      }
    return this
  }
  redraw() {
    this.initVnode()
    this.render()
    if (typeof this.vnode.children !== "string") {
      for (const child of this.vnode.children) {
        child.redraw()
      }
    }
    this.draw()
    return this
  }
  mount(dom) {
    this.redraw()
    dom.innerHTML = ""
    dom.appendChild(this.dom)
    return this
  }
}

const t = function() { return new Tag() }
t.Tag = Tag

export default t
export {Tag,t}



