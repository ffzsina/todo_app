import {BrowserRouter, NavLink, Redirect, Route, Switch} from "react-router-dom";
import './App.css';
import {TaskListPage} from "./TaskListPage";
import {TaskSinglePage} from "./TaskSinglePage";
import {TaskCreatePage} from "./TaskCreatePage";
import {TaskUpdatePage} from "./TaskUpdatePage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faColumns, faPlus} from "@fortawesome/free-solid-svg-icons";

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand navbar-light bg-warning">
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink to={"/"} activeClassName="active" exact className="text-decoration-none">
                <span className="nav-link">
                  <h2><FontAwesomeIcon icon={faColumns}/></h2>
                </span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to={"/new-task"} activeClassName="active" className="text-decoration-none">
                <span className="nav-link">
                  <h2><FontAwesomeIcon icon={faPlus}/></h2>
                </span>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
      <Switch>
        <Route path="/" exact component={TaskListPage}/>
        <Route path="/task/:taskId" component={TaskSinglePage}/>
        <Route path="/new-task" component={TaskCreatePage}/>
        <Route path="/edit-task/:taskId" component={TaskUpdatePage}/>
        <Redirect to={"/"}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;