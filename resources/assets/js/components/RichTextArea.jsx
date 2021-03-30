
import React, { Component } from 'react';
import { init as pellInit } from 'pell';
import 'pell/dist/pell.min.css';
import { create } from 'domain';

export default class Richtextarea extends Component {
    constructor(props) {
        super(props);
        this.editor = null;
        this.state = {
            initValue: false,
            i: 1
        }
    }

    reset() {
        this.editor.content.innerHTML = "";
    }

    // componentWillMount() {
    //     Stylesheet.append("https://unpkg.com/pell@1.0.4/dist/pell.min.css", true);
    // }

    // componentWillUnmount() {
    //     Stylesheet.detach("https://unpkg.com/pell@1.0.4/dist/pell.min.css", true);
    // }

    setValue() {
        if (this.props.initValue && !this.state.initValue && this.editor) {
            this.editor.content.innerHTML = this.props.initValue;
            this.setState({
                initValue: true
            })
        }
    }



    // fillinbutton() {
    //     var div = document.createElement('a');
    //     div.textContent = this.fillinNumber();
    //     div.setAttribute('class', 'fillin-container');
    //     this.editor.content.appendChild(div);
    // }

    componentDidMount() {
        this.editor = pellInit({
            element: document.getElementById(this.props.id || 'richtextarea'),
            onChange: this.props.onChange,
            defaultParagraphSeparator: this.props.fillIn == true ? 'span' : 'p',
            styleWithCSS: true,
            actions: this.props.style ? [
                'bold',
                'italic',
                'underline',
                'strikethrough',
                'olist',
                'ulist',
                'quote',
                'line',
                {
                    name: 'fillin',
                    icon: '☐',
                    title: 'Fillin Action',
                    result: () =>
                        this.editor.content.insertAdjacentHTML('beforeend', '<a class="fillin-container">' + this.fillinNumber() + '</a> &nbsp')
                }
            ] : [],
            classes: this.props.style ? {
                actionbar: 'pell-actionbar',
                button: 'pell-button',
                content: 'pell-content',
                selected: 'pell-button-selected'
            } : {
                    actionbar: '',
                    selected: '',
                    button: '',
                    content: 'h-100 p-3'
                }
        });

        this.setValue();
    }

    fillinNumber() {
        // const i = 0;
        return this.state.i++;
    }

    render() {
        this.setValue();

        return (
            <div id={this.props.id || "richtextarea"} className={this.props.className ? this.props.className : "pell"} />
        );
    }
}
