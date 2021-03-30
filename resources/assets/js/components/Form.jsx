import React from "react";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { stateFromHTML } from 'draft-js-import-html';

export const FormInput = (props) => (
  <div className="form-group">
    {props.label && <label>{props.label}</label>}
    <input
      type={props.type || 'text'}
      className="form-control"
      placeholder={props.placeholder || ''}
      onChange={props.onChange}
      value={props.value}
    />
  </div>
);

export const FormSelect = (props) => (
  <div className="form-group">
    {props.label && <label>{props.label}</label>}
    <select
      className="form-control"
      onChange={props.onChange}
      value={props.value}
      disabled={props.disabled}
    >
      {
        Object.keys(props.options).map((key) =>
          <option value={key} key={`opt-${key}`}>{props.options[key]}</option>
        )
      }
    </select>
  </div>
);

export const FormDate = (props) => (
  <div className="form-group">
    {props.label && <label>{props.label}</label>}
    <DatePicker
      className="form-control"
      selected={props.startDate}
      onChange={props.onChange}
      dateFormat="YYYY-MM-DD"
    />
  </div>
);

export const FormDateTime = (props) => (
  <div className="form-group">
    {props.label && <label>{props.label}</label>}
    <DatePicker
      className="form-control"
      selected={props.startDate}
      onChange={props.onChange}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={15}
      dateFormat="LLL"
      timeCaption="time"
    />
  </div>
);

export class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultEditorState: EditorState.createEmpty()
    }
  }

  setIntitialState(value) {
    const blocksFromHTML = stateFromHTML(value || "");
    this.setState({
      defaultEditorState: EditorState.createWithContent(
        blocksFromHTML
      )
    });
  }

  render() {
    return (
      <div className="form-group">
        {
          this.props.label && <label>{this.props.label}</label>
        }
        <Editor
          editorState={this.state.defaultEditorState}
          wrapperClassName="form-group"
          editorClassName="border-box p-2"
          onEditorStateChange={(val) => {
            this.props.onChange ? this.props.onChange(draftToHtml(convertToRaw(val.getCurrentContent())), val) : null;
            this.setState({ defaultEditorState: val });
          }}
          toolbar={{
            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link']
          }}
        />
      </div>
    );
  }
}