import React from 'react';
import { Link } from "react-router-dom";

const List = (props) => (
  <li className="slide-down-dropdown">
    <Link to={props.data.link} className={props.selected === props.data.link.replace('/', '') ? "selected" : ""}>
      <i className={"fa " + props.data.icon}> </i> {props.data.label}
    </Link>
  </li>
);

const Sidebar = () => {
  const path = window.location.pathname.split('/');

  const sidebarItem = [
    { label: 'Dashboard', link: '/', icon: "fa-home" },
    { label: 'Daftar Mahasiswa', link: '/student', icon: "fa-users" },
    { label: 'Daftar Dosen', link: '/teacher', icon: "fa-graduation-cap" },
    { label: 'Daftar Matakuliah', link: '/subject', icon: "fa-file" },
    { label: 'Daftar Tahun Ajar', link: '/teaching-period', icon: "fa-calendar" },
    { label: 'Daftar Jurusan', link: '/category', icon: "fa-university"},
    { label: 'Daftar Kelas', link: '/classroom', icon: "fa-clock" }
  ]

  return (
    <div className="col-lg-2 col-md-3 topic-sidebar topic-sidebar-bg">
      <ul className="list-group">

        {
          sidebarItem.map((item, i) =>
            <List data={item} selected={path[1]} key={item.link + i} />
          )
        }

        <li className="slide-down-dropdown">
          <a href="/start/quizzes" >
            <i className="fa fa-question-circle"> </i> Daftar Kuis
          </a>
        </li>
      </ul>
    </div>
  )
};

export default Sidebar;