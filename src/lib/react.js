import {renderComponent} from "./react-dom.js";



function createElement(tag, attrs, ...children) {
    return {
        tag,
        attrs,
        children
    }
}

class Component {
    constructor(props) {
        this.props = props
        this.states = {}
    }

    setStates(newState) {
        Object.assign(this.states, newState)
        console.log('hello')
        renderComponent(this)
    }

}

const React = {
    createElement,
    Component
}

// export default React 

export {
    createElement,
    Component
}

export default {
    createElement,
    Component
}