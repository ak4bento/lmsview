import React from 'react';

import {
  FormInput
} from "../../../components/Form";

const TeacherFormEmail = props => {
  return (
    <div className="padding-tb-1">
      <p className="text primary-text text-upper small-text padding-tb-half">  
        Akun
      </p>

      <div className="form-group">
        <FormInput
          type="email" 
          label="Email" 
          placeholder="Masukkan Email" 
          value={props.email}
          onChange={(e) => props.setState({email: e.currentTarget.value})}
        />
        <small
          id="emailHelp"
          className="text-small form-text text-muted"
        >     
          Pastikan email aktif
        </small>
      </div>
    </div>
  )
}

export default TeacherFormEmail;