import checkType from "icat_checkType"

Tag = class
  constructor: ()->
    @initVnode()
    @render = ->
    @dom = null
    @html = ""
    @initParams = ->
    @parent = null

  initVnode: ()->
    @vnode =
      tagName:"div"
      attrs:{}
      params:{}
      children:[]
    @

  view: (fn)->
    checkType arguments,["function"],"Tag.view()"
    @render = ->
      @initParams()
      fn(@)
    @
  inject: (fn)->
    checkType arguments,["function"],"Tag.inject()"
    oldRender = @render

    @render = ->
      oldRender.call @
      fn(@)
    @
  param: (paramFn)->
    checkType arguments,["function"],"Tag.param()"
    @initParams = ->
      @vnode.params = {
        @vnode.params...
        paramFn()...
      }
    @
  to: (fn)->
    checkType arguments,["function"],"Tag.to()"
    fn(@)
    @
  tag: (name)->
    checkType arguments,["string"],"Tag.tag(name)"
    @vnode.tagName = name
    @
  $tag: (nameFn)->
    checkType arguments,["function"],"Tag.$tag()"
    @inject (self)=>
      self.tag(nameFn(@))
    @
  $attr: (attrObjFn)->
    checkType arguments,["function"],"Tag.$attr()"
    @inject (self)=>
      self.attr attrObjFn(@)
    @
  $style: (styleObjFn)->
    checkType arguments,["function"],"Tag.$style()"
    @inject (self)=>
      self.style styleObjFn(@)
    @
  $children: (tagArrFn)->
    checkType arguments,["function"],"Tag.$children()"
    @inject (self)=>
      self.children tagArrFn(@)
    @
  $inner: (tagArrFn)->
    @$children(tagArrFn)

  setParent: (tag)->
    checkType arguments,["object"],"Tag.setParent(tag)"
    @parent = tag
    @
  attr: (attrObj)->
    checkType arguments,["object"],"Tag.attr(attrObj)"
    if attrObj.style
      throw new Error "please use style replace attr"
    @vnode.attrs = {
      @vnode.attrs...
      attrObj...
    }
    @
  style: (styleObj)->
    checkType arguments,["object"],"Tag.style(styleObj)"
    @vnode.attrs.style = {
        @vnode.attrs.style...
        styleObj...
      }
    @
  clone: ()->
    clone = new Tag()
    clone.initParams = @initParams
    clone.render = @render
    clone.parent = @parent
    clone.vnode = JSON.parse JSON.stringify @vnode
    clone

  child: (tag)->
    checkType arguments,[["object","string","number","null"]],"Tag.child(tag)"
    unless Tag
      return
    switch typeof tag
      when "string","number"
        @vnode.children.push new Tag().view (self)=>self.text(tag).setParent(@)
      else
        if tag not instanceof Tag
          console.error tag
          throw new Error "tag not instance of Tag"
        @vnode.children.push tag.setParent(@)
    @
  text: (str)->
    checkType arguments,[["string","number"]],"Tag.text(str)"
    @vnode.children = str
    @
  children: (children)->
    checkType arguments,[["array","string","number","null"]],"Tag.children()"
    if typeof children is "string" or typeof children is "number"
      @child children
    else
      for child in children.flat()
        @child child
    @
  
  draw:()->
    switch typeof @vnode.children
      when "string","number"
        @dom ?= document.createTextNode ""
        if @dom
          parent = @dom.parentNode
          if parent
            parent.removeChild @dom
            @dom = document.createTextNode ""
            @dom.parentNode.appendChild @dom
            
        @dom.data = String @vnode.children
        @html = String @vnode.children
      else
        @dom ?= document.createElement @vnode.tagName

        if @dom and @dom.tagName.toLowerCase() isnt @vnode.tagName
          parent = @dom.parentNode
          if parent
            parent.removeChild @dom 
            @dom = document.createElement @vnode.tagName
            parent.appendChild @dom

        
        for own key,attr of @vnode.attrs
          do(key,attr)=>
            if key is "style"
              if typeof(attr) is "string"
                @dom.style = attr
              else
                for own name,value of attr
                  do(name,value)=>
                    @dom.style[name] = value
            else
              if key.match /^data-/g
                @dom.setAttribute key,attr
              else
                @dom[key] = attr
              
        #@dom.appendChild child.dom for child in @vnode.children

    @
  drawChildren: ()->
    if typeof @vnode.children isnt "string" and typeof @vnode.children isnt "number"
      @dom.innerHTML = ""
      for child in @vnode.children
        @dom.appendChild child.dom
    @

  redraw:()->
    @initVnode()
    @render()

    if typeof (@vnode.children) isnt "string" and typeof(@vnode.children) isnt "number"
      for child in @vnode.children
        do(child)=>
          child.redraw()
    @draw()
    @drawChildren()

    if @vnode.attrs.oncreate
      @vnode.attrs.oncreate @dom,@
    @
  mount:(dom)->
    checkType arguments,[["htmldivelement","htmlhtmlelement"]],"Tag.mount()"
    @redraw()
    dom.innerHTML = ""
    dom.appendChild @dom
    @

t = -> new Tag()
t.Tag = Tag


Tag::视图 = Tag::view
Tag::注入 = Tag::inject
Tag::样式 = Tag::style
Tag::参数 = Tag::param
Tag::传递 = Tag::to
Tag::标签 = Tag::tag 
Tag::$标签 = Tag::$tag
Tag::属性 = Tag::attr 
Tag::$属性 = Tag::$attr
Tag::子树 = Tag::children
Tag::$子树 = Tag::$children
Tag::克隆 = Tag::clone
Tag::文本 = Tag::text
Tag::绘制 = Tag::draw
Tag::重绘 = Tag::redraw
Tag::挂载 = Tag::mount


export default t
export {Tag,t}



