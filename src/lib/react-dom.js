import React from './react'


function setAttribute(node, attrs) {
    if(!attrs) return;
        for(let key in attrs) {
            if(key.startsWith('on')) {
                node[key.toLocaleLowerCase()] = attrs[key];
            } else if(key === 'style') {
                Object.assign(node.style, attrs[key]);
            } else {
                node[key] = attrs[key];
            }
        }
   }

function renderVdom(vdom, container) {
  let node = createDomfromVdom(vdom)
  container.appendChild(node)

}


function createDomfromVdom(vdom) {
    let node
    if(typeof vdom === "string") {
        node = document.createTextNode(vdom)
        return node
    }
    if(typeof vdom === "object") {
        if(typeof vdom.tag === 'function') {
            let component = getComponent(vdom.tag, vdom.attrs)
            let vnode = component.render()
            node = createDomfromVdom(vnode)
            component.$root = node
        } else{
            node = document.createElement(vdom.tag)
            setAttribute(node, vdom.attrs)
            vdom.children.forEach(childrenVdom => renderVdom(childrenVdom, node))
        }

    }
    return node
}


function getComponent(constructor, attrs) {
    if(constructor.prototype instanceof React.Component) {
        return new constructor(attrs)
    } else {
        let App = class extends React.Component {}
        App.prototype.render = function() {
            return constructor(attrs)
        }
        return new App(attrs)

    }
}

function renderComponent(component) {
    let vdom = component.render()
    let node = createDomfromVdom(vdom)
    if(component.$root) {
        component.$root.parentNode.replaceChild(node, component.$root)
    }
    console.log('render')
}

function render(vdom, container) {
    container.innerHTML = ''
    renderVdom(vdom, container)
}

const ReactDOM = {
    render(vdom, container) {
        container.innerHTML = ""
        render(vdom, container)
    },
    renderComponent
}

// export default ReactDOM

export {
    render,
    renderComponent,
    ReactDOM
}

export default {
    render,
    renderComponent,
    ReactDOM
}