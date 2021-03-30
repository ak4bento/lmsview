import React, { Component, Fragment } from 'react';
import { CancelToken, isCancel } from "axios";
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw, EditorState } from "draft-js";
import { stateFromHTML } from 'draft-js-import-html';
import { isEmpty } from "lodash";
import { Redirect } from "react-router-dom";

import TeachablesApi from "../../api/teachables";
import MediaApi from "../../api/media";
import Breadcrumb from '../Breadcrumb';
import ResourceTypes from './ResourceTypes';
import ResourceFiles from './ResourceFiles';
import ResourceSettings from './ResourceSettings';

import DeleteComponent from './DeleteComponent';

import JWVideoResource from '../teachable/JWVideoResource';
import DocumentsResource from '../teachable/DocumentsResource';
import AudioResource from '../teachable/AudioResource';
import ExternalLinkResource from '../teachable/ExternalLinkResource';
import YoutubeVideoResource from '../teachable/YoutubeVideoResource';
import LinkVideoResource from '../teachable/LinkVideoResource';

class ResourceEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      editorState: EditorState.createEmpty(),
      resourceType: null,
      resourceFile: null,
      typeSettings: {},
      files: [],
      data: null,
      audio: null,
      updated: {
        resourceType: null,
        resourceFile: null,
        typeSettings: {},
        files: [],
        audio: null
      },
      update: false,
      saving: false,
      saved: false,
    };
    this.api = new TeachablesApi;
    this.media = new MediaApi;
    this.cancelRequestHandler = CancelToken.source();
  }

  componentWillUnmount() {
    this.cancelRequestHandler.cancel();
  }

  componentDidMount() {
    const blocksFromHTML = stateFromHTML(this.props.teachable.teachableItem.data.description || "");

    this.props.teachable &&
      this.setState({
        title: this.props.teachable.teachableItem.data.title,
        description: this.props.teachable.teachableItem.data.description,
        resourceType: this.props.teachable.teachableItem.data.type,
        data: this.props.teachable.teachableItem.data.data,
        files: this.props.teachable.teachableItem.data.media,
        editorState: EditorState.createWithContent(
          blocksFromHTML
        )
      })
  }

  save() {
    if (this.state.saving)
      return;

    this.setState({ saving: true, error: false });

    let data = new FormData;
    data.append('classroom', this.props.match.params.classroom);
    data.append('teachableType', 'resource');
    data.append('title', this.state.title);
    data.append('description', this.state.description);
    data.append('resourceType', this.state.resourceType);
    data.append('resourceTypeSettings', JSON.stringify(this.state.typeSettings));
    data.append('resourceFile', this.state.updated.resourceFile);
    data.append('_method', 'patch');
    data.append('old_files', JSON.stringify(this.state.files));

    if (this.state.updated.files.length) {
      this.state.updated.files.forEach((file, index) => {
        data.append('file[' + index + ']', file);
      });
    }

    return this.api.updateMultipartFormData({
      id: this.props.teachable.id,
      params: { teachableType: 'resource' },
      data,
      cancelToken: this.cancelRequestHandler.token,
      cb: data => this.setState({ saved: true }),
      err: (e) => !isCancel(e) && this.setState({ error: e.response ? e.response.data : true, saving: false }),
    });
  }

  handlingSection() {
    this.setState({
      update: !this.state.update
    })
  }

  updateResource() {
    let updatedData = null;
    let data = {};

    switch (this.state.resourceType) {
      case 'documents':
        updatedData = <DocumentsResource media={this.state.files} />; break;
      case 'linkvideo':
      case 'jwvideo':
      case 'youtubevideo':
      case 'url':
        data = JSON.stringify(this.state.updated.typeSettings); break;
    }

    this.setState({
      typeSettings: this.state.updated.typeSettings,
      data,
      update: false
    })

    console.log(updatedData);

  }

  delete(id) {
    return this.media.destroy({
      id: id,
      params: {
        context: 'teacher'
      },
      cancelToken: this.cancelRequestHandler.token,
      cb: data => { window.location.reload(); console.log('delete success', id) },
      err: e => !isCancel(e) && this.setState({ error: e.response ? e.response.data : true, saving: false })
    });
  }

  render() {

    console.log(this.state);

    let resourceComponent = null;

    switch (this.state.resourceType) {
      case 'jwvideo':
        resourceComponent = <JWVideoResource {...this.state} />; break;
      case 'youtubevideo':
        resourceComponent = <YoutubeVideoResource {...this.state} />; break;
      case 'linkvideo':
        resourceComponent = <LinkVideoResource {...this.state} />; break;
      case 'audio':
        resourceComponent = <AudioResource media={this.state.files} />; break;
      case 'documents':
        resourceComponent = <DocumentsResource media={this.state.files} />; break;
      case 'url':
        resourceComponent = <ExternalLinkResource {...this.state} />; break;
    }

    if (this.state.saved)
      return <Redirect to={'/classroom/' + this.props.match.params.classroom + '/teachable/' + this.props.match.params.id} />

    return (
      <Fragment>
        <Breadcrumb items={[
          { link: '/classroom/' + this.props.match.params.classroom, label: 'Classroom' },
          { label: 'Edit Resource' },
        ]} />
        <div className="row justify-content-center">
          <div className="col-lg-8">

            {console.log(this.state)}

            <div className="mb-4">

              <div className="mb-5">
                <div className="form-group">
                  <input type="text" value={this.state.title} className="form-control form-control-lg" placeholder="Title" onChange={e => this.setState({ title: e.target.value })} />
                </div>
                <div className="form-group">
                  <div className={"mb-2 p-3 bg-white border border-muted rounded" + (this.state.saving ? ' bg-light text-muted' : '')}>
                    <Editor
                      editorState={this.state.editorState}
                      editorClassName="form-control"
                      onEditorStateChange={
                        description => this.setState({
                          description: draftToHtml(convertToRaw(description.getCurrentContent())),
                          editorState: description
                        })
                      }
                      toolbar={{
                        options: ['inline']
                      }}
                      placeholder="Description" />
                  </div>
                </div>
              </div>

              {this.state.resourceType !== 'documents' &&
                <div className="mb-4">
                  <div className="row justify-content-end my-2">
                    <div className="col-6">
                      <strong>
                        {
                          this.state.resourceType &&
                          types.find(o => o.key === this.state.resourceType).label
                        }
                      </strong>
                    </div>
                    <div className="col-6 text-right">
                      <a className="text-primary pb-2 px-2"
                        onClick={() => this.handlingSection()}
                      >Ganti Bahan Ajar </a>
                    </div>

                  </div>

                  <div className="d-flex justify-content-center align-items-center bg-dark text-muted mb-4 py-4">
                    {resourceComponent}
                  </div>

                </div>
              }



            </div>

            {this.state.update && (
              <div className="rounded p-4 my-4 border">
                <Fragment>
                  <div className="my-4">
                    <ResourceSettings
                      type={this.state.resourceType}
                      settings={this.state.updated.typeSettings}
                      onUpdate={typeSettings => this.setState({ updated: Object.assign(this.state.updated, { typeSettings }) })}
                      onUpdateResourceFile={resourceFile => this.setState({ updated: Object.assign(this.state.updated, { resourceFile }) })}
                      onUpdateFiles={files => this.setState({ updated: Object.assign(this.state.updated, { files }) })} />
                  </div>

                  {this.state.resourceType !== 'audio' &&
                    <div className="d-block my-2 text-right">
                      <p onClick={() => this.handlingSection()} className="d-inline-block px-4 link secondary-link"> Batal </p>
                      <button className="btn btn-primary" onClick={this.updateResource.bind(this)}> Save </button>
                      <p className="my-2 small"> Apa Anda yakin? Ini akan menggantikan resource yang sudah ada sebelumnya </p>
                    </div>
                  }


                </Fragment>

              </div>
            )}


            {
              this.state.resourceType !== null && this.state.files &&
              (
                <Fragment>

                  <div className="py-4">
                    <div className="h6 strong text-uppercase"> {this.state.resourceType == 'documents' ? 'Bahan Ajar' : 'Dokumen Tambahan yang menunjang pembelajaran'} </div>

                    {
                      this.state.files ? (
                        this.state.files.data.map((data, i) =>
                          data.collection == 'files' ?
                            <div className="row py-2 mx-0 align-items-center border-bottom" key={i}>
                              <div className="d-inline-block">
                                <div className="h2 text-primary"> <i className="fas fa-file" ></i></div>
                              </div>

                              <div className="col py-2">
                                <p className="mb-0"> <strong> {data.name} </strong> </p>
                                <p className="mb-0"> {data.fileName} </p>
                              </div>

                              <div className="col py-2 text-right">
                                <a href="#" className="text-danger py-2 px-4" data-toggle="modal" data-target={'#' + data.id}> <i className="fa fa-trash"> </i> Hapus </a>
                              </div>

                              <DeleteComponent delete={this.delete.bind(this)} id={data.id} />

                            </div>
                            : 'Belum ada dokumen tambahan penunjang.'
                        )) : ''

                    }

                  </div>




                  <div className="bg-white rounded shadowed py-4 my-5">
                    <div className="px-4 text-uppercase h6 mb-2">{this.state.resourceType == 'documents' ? 'Menambahkan Dokumen' : 'Dokumen Tambahan'}</div>
                    <div className="px-4 mb-4">{this.state.resourceType == 'documents' ? 'Untuk menambahkan dokumen gunakan area dibawah.' : 'Anda dapat menambahkan dokumen penunjang pembelajaran dengan Area dibawah ini'} </div>
                    <div>
                      <ResourceFiles onUpdateFiles={files =>
                        this.setState({ updated: Object.assign(this.state.updated, { files }) })
                      } />
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      disabled={
                        this.state.saving
                        // || !this.state.title.length
                        // || (this.state.resourceType !== 'documents' && this.state.resourceType !== 'audio' && isEmpty(this.state.typeSettings))
                        // || (this.state.resourceType === 'documents' && isEmpty(this.state.files))
                        // || (this.state.resourceType === 'audio' && this.state.resourceFile === null)
                      }
                      className="btn btn-primary btn-lg px-5"
                      onClick={() => this.save()}>
                      {this.state.saving ? 'Please wait..' : 'Save'}
                    </button>
                  </div>
                </Fragment>
              )
            }

          </div>
        </div>
      </Fragment>
    );
  }

}

const types = [
  { key: 'jwvideo', label: 'Cloud Video', icon: 'film' },
  { key: 'linkvideo', label: 'Link Video', icon: 'play-circle' },
  { key: 'youtubevideo', label: 'YouTube', icon: 'video' },
  { key: 'documents', label: 'Documents', icon: 'copy' },
  { key: 'audio', label: 'Audio', icon: 'headphones' },
  { key: 'url', label: 'Webpage', icon: 'link' },
];


export default ResourceEdit;