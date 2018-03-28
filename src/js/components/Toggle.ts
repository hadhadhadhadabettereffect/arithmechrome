let tmpl = document.createElement("template");
tmpl.innerHTML = `
    <style scope="active-toggle">
        #wrap {
            position: relative;
            width: 28px;
            height: 16px;
            z-index: 0;
        }
        #bar {
            background-color: gray;
            border-radius: 8px;
            height: 12px;
            left: 3px;
            opacity: 0.4;
            position: absolute;
            top: 2px;
            transition: background-color linear 80ms;
            width: 24px;
            z-index: 0;
        }
        #button {
            background-color: #ccc;
            border-radius: 50%;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.4);
            height: 16px;
            position: relative;
            transition: transform linear 80ms, background-color linear 80ms;
            width: 16px;
            z-index: 1;
        }
        :host([checked]) #bar {
            background-color: #319cb3;
        }
        :host([checked]) #button {
            background-color: #319cb3;
            transform: translate3d(14px, 0, 0);
        }
    </style>
    <div id="wrap">
        <div id="bar"></div>
        <div id="button"></div>
    </div>
`;

class Toggle extends HTMLElement {

    constructor() {
        super();

        let shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.appendChild(tmpl.content.cloneNode(true));

        this.addEventListener("click", e => {
            this.toggle();
        })
    }

    static get observedAttributes() {
        return ['checked'];
    }

    get checked() {
        return this.hasAttribute("checked");
    }

    set checked(val) {
        if (val) {
            this.setAttribute("checked", "");
        } else {
            this.removeAttribute("checked");
        }
    }

    toggle() {
        this.checked = !this.checked;
        this.dispatchEvent(new Event("toggle"));
    }
}

window.customElements.define("active-toggle", Toggle);