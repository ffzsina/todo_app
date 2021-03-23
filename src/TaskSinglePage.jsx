import {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {NavLink} from "react-router-dom";
import {Modal, Spinner, CantFind} from "./Snippets";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash, faPencilAlt, faClock} from "@fortawesome/free-solid-svg-icons";
import Countdown from 'react-countdown';

export function TaskSinglePage(props){
    const history = useHistory();
    const id = props.match.params.taskId;
    const [task, setTask] = useState({});
    const [isPending, setPending] = useState(false);
    const [isDelete, setDelete] = useState(false);
    const [dueDate, setDueDate] = useState();

    const Completionist = () => <span className="text-danger">Expired</span>;
    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            return <Completionist />;
        } else {
            return(
                <div>
                    <div className="d-inline-block mr-1">{days} days,</div>
                    <div className="d-inline-block mr-1">{hours} hours,</div>
                    <div className="d-inline-block mr-1">{minutes} minutes</div>
                    <div className="d-inline-block small">({seconds})</div>
                </div>
            );
        }
    };

    useEffect(() => {
        setPending(true);
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}`, {credentials: "include"})
        .then((res) => res.json())
        .then(setTask)
        .catch(console.log)
        .finally(() => {setPending(false);});
        
    }, []);

    useEffect(() => {
        setDueDate(new Date(task.due));
    }, [task]);

    if (isPending){
        return <Spinner/>;
    }

    if (!task.id){
        return <CantFind/>;
    }

    return(
        <div className="p-5 m-auto content">   
            <div>
                {isDelete ? (
                    <Modal onApproved={async () => {            
                        await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}`, {method: "DELETE"})
                        .then(() => {history.push("/");});
                        }}
                        onClosed={() => setDelete(false)}>
                        Are you sure you want to delete this task?
                    </Modal>
                    ) : (
                    ""
                )}
                <div className="card p-3 mb-3 mt-3 text-center">
                    <div className="card-header">
                        <div className="d-inline-block">
                            <h1 className="card-title">
                                {task.title}
                            </h1>
                            <hr/>
                            <div>
                                <div className="small d-inline-block p-2 bg-secondary text-white mr-2 mb-1">
                                    {["important", "medium", "minor"][task.priority]}
                                </div>
                                <div className="small d-inline-block p-2 bg-primary text-white mr-2">
                                    {["todo", "in progress", "done"][task.taskstate]}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col mb-2">
                                <div className="card">
                                    <div className="card-body">
                                        <h4>Due date:</h4>
                                        {task.isdue ?
                                            <h4>{task.due.split("T")[0]} {task.due.split("T")[1].split(":")[0]}:{task.due.split("T")[1].split(":")[1]}</h4>
                                            :
                                            ""
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col mb-3">
                                <div className="card">
                                    {!task.isdue ?
                                        <div className="card-body">
                                            <h4>
                                                <FontAwesomeIcon icon={faClock} className="mr-2" />
                                                Without time limit
                                            </h4>
                                        </div>
                                        :    
                                        <div className="card-body">
                                            <h4>
                                                <FontAwesomeIcon icon={faClock}/>
                                            </h4>
                                            <h4>
                                                <Countdown date={dueDate} renderer={renderer}/>
                                            </h4>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <hr/>
                        <p className="lead text-left">{task.info}</p>
                    </div>
                    <div className="card-footer">   
                        <NavLink to={"/edit-task/" + task.id}>
                            <button className="btn btn-warning text-white mr-2">
                                <FontAwesomeIcon icon={faPencilAlt}/>
                            </button>
                        </NavLink>
                        <button className="btn btn-danger" onClick={() => {
                            setDelete(true);
                        }}>
                            <FontAwesomeIcon icon={faTrash}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}