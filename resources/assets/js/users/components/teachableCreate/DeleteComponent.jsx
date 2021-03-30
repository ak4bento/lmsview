import React, { Component } from 'react';

class DeleteComponent extends Component {

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div className="modal fade" role="dialog" id={this.props.id} tabIndex="-1" aria-labelledby={this.props.id} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Anda yakin untuk menghapus ini ? Konten akan terhapus dan tidak dapat dikembalikan </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal"> Batal </button>
              <button type="button" className="btn btn-primary" onClick={(e) => this.props.delete(this.props.id)} > Hapus </button>
            </div>
          </div>
        </div>

      </div>

    );
  }
}

export default DeleteComponent;