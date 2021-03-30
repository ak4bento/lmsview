import React, { Component } from 'react';
import { CancelToken, isCancel } from "axios";
import { convertToRaw, Editor, EditorState, RichUtils } from "draft-js";
import toHTML from "draftjs-to-html";

import DiscussionsApi from "../../api/discussions";

class ReplyForm extends Component {

  constructor(props) {
    super(props);
    this.defaultState = {
      error: false,
      saving: false,
      editorState: EditorState.createEmpty(),
    }
    this.state = Object.assign({}, this.defaultState);
    this.cancelRequestHandler = CancelToken.source();
    this.api = new DiscussionsApi;
  }

  componentWillUnmount() {
    this.cancelRequestHandler.cancel();
  }

  save() {
    if (this.state.saving)
      return;

    this.setState({ saving: true, error: false });
    let message = toHTML(convertToRaw(this.state.editorState.getCurrentContent()));
    return this.api.store({
      data: {
        message,
        context: this.props.context,
        [this.props.context]: this.props.contextData,
        replyTo: this.props.replyTo,
      },
      cancelToken: this.cancelRequestHandler.token,
      cb: data => {
        this.reset();
        return this.props.onSaved(data.data);
      },
      err: e => !isCancel(e) && this.setState({ saving: false, error: true })
    });
  }

  reset() {
    this.setState(Object.assign({}, this.defaultState));
  }

  render() {
    let messagePlainText = this.state.editorState.getCurrentContent().getPlainText();

    return (
      <div className="px-3 py-3 bg-white border rounded shadowed">
        <div className="mb-2">
          {
            inlineStyles.map(inlineStyle =>
              <StyleButton
                key={inlineStyle.style}
                {...inlineStyle}
                active={this.state.editorState.getCurrentInlineStyle().has(inlineStyle.style)}
                onToggle={() => this.setState({ editorState: RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle.style) })} />
            )
          }
        </div>
        <div className={"mb-2 p-3 border rounded" + (this.state.saving ? ' bg-light text-muted' : '')}>
          <Editor readOnly={this.state.saving} editorState={this.state.editorState} onChange={editorState => this.setState({ editorState })} placeholder="Type your message here.." />
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div className={messagePlainText.length > charLimit ? "text-danger" : "text-muted"}>{messagePlainText.length}/{charLimit}</div>
          <div className="d-inline-flex align-items-center">
            {
              this.state.error &&
              <div className="text-danger mr-2">Tidak dapat mengirim pesan</div>
            }
            {
              this.props.replyTo && !this.state.saving &&
              <a href="#" onClick={e => { e.preventDefault(); this.props.onCancel() }} className="text-secondary mx-3">Batalkan</a>
            }
            <button
              className={"btn btn-primary"}
              onClick={() => this.save()}
              disabled={messagePlainText.length > charLimit || messagePlainText.length === 0 || this.state.saving}>
              {this.state.error ? 'Ulangi' : (this.props.replyTo ? 'Buat balasan' : 'Mulai diskusi')}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const inlineStyles = [
  { icon: 'bold', label: 'Bold', style: 'BOLD' },
  { icon: 'italic', label: 'Italic', style: 'ITALIC' },
  { icon: 'underline', label: 'Underline', style: 'UNDERLINE' },
];

const charLimit = 1000;

const StyleButton = props => (
  <button
    className={"btn mr-1 " + (props.active ? 'btn-outline-secondary' : 'text-dark btn-link')}
    title={props.label}
    onClick={() => props.onToggle()}>
    <i className={"fas fa-" + props.icon}></i>
  </button>
);

export default ReplyForm;