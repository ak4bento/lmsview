import React, { Component } from "react";
import {
  Redirect,
  Link
} from "react-router-dom";
import {
  FormInput,
  FormSelect,
  TextEditor
} from "../../../components/Form";

import categoriesApi from '../../api/catgories';

class CategoryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "" ,
      faculties: {0: '--Pilih--'} ,
      onSubmitProcess: false
    }

    this._descriptionEditor = null;
  }

  save(e) {
    this.setState({
      onSubmitProcess: true
    });

    const { name, faculty } = this.state;
    const { id } = this.props.match.params;
    const form = {
      name ,
      faculty ,
    }

    if ( id ) {
      categoriesApi.update({
        id ,
        form
      }, (res, err) => {
        this.setState({
          onSubmitProcess: false ,
          isSubmitSuccess: err ? false : res.category ? true : false
        });
      });
    } else {
      categoriesApi.store({
        form
      }, (res, err) => {
        this.setState({
          onSubmitProcess: false ,
          isSubmitSuccess: err ? false : res.category ? true : false
        });
      });
    }
    
    e.preventDefault();
  }

  callFauclties() {
    categoriesApi.index(
      { params: { context: 'parent' } } ,
      (faculties, err) => {
        if (!err) {
          const facultiesObj = {0: '--Pilih--'};
          faculties.map(faculty => {
            facultiesObj[faculty.id] = faculty.name;
          });
          this.setState({faculties: facultiesObj});
        }
      }
    );
  }

  callCategory(id) {
    categoriesApi.view({id: id}, (result, err) => {
      if (!err) {
        const { name } = result;
        this.setState({
          name,
        });
      }
    });
  }

  componentWillMount() {
    this.callFauclties();
    const { id } = this.props.match.params;
    if (id) {
      this.callCategory(id);
    }
  }

  render() {
    console.log("category edit", this.state);

    if (this.state.isSubmitSuccess) {
      return <Redirect to='/category' push />
    }

    return (
      <div className="d-block padding-2 text-left">
        <Link to="/category" className="link primary-link">
          <i className="fa fa-angle-left"> </i> Kembali
        </Link>

        <div className="white-bg padding-1 border-radius box-shadow">
          <form onSubmit={this.save.bind(this)}>
            <div className="border-bottom">
              <p className="text primary-text text-upper small-text padding-tb-half">
                Informasi
              </p>

              <FormInput
                label="Nama Jurusan"
                placeholder="Masukkan Nama Jurusan"
                value={this.state.name}
                onChange={(e) => this.setState({ name: e.currentTarget.value })}
              />

              <FormSelect
                label="Fakultas"
                options={this.state.faculties}
                value={this.state.faculty}
                onChange={(e) => this.setState({ faculty: e.currentTarget.value })}
              />

            </div>

            <div className="grey-bg text-right padding-tb-1">
              <Link to="student" className="link third-link padding-half" disabled={this.state.onSubmitProcess}>
                Batal
              </Link>

              <button type="submit" className="btn btn-primary" disabled={this.state.onSubmitProcess}>
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default CategoryForm;
