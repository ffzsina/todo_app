import {useState} from "react";
import {NavLink} from "react-router-dom";
import {Modal} from "./Snippets";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faAngleRight, faCaretDown, faCaretUp, faArrowsAlt, faTrash, faPencilAlt, faTimes, faCheck} from "@fortawesome/free-solid-svg-icons";

export function SelectedCard(props){
    const [priority, setPriority] = useState(props.task.priority);
    const [taskState, setTaskState] = useState(props.task.taskstate);
    
    return (
        <div className="card w-100 d-inline-block m-1 p-2 border-warning" key={props.task.id}>
            <div className="card-header">
                <div className="row">
                    <div className="col small d-flex justify-content-center mb-1">
                        <button className="btn btn-sm btn-outline-secondary mr-2" disabled={priority>=2}
                            onClick={() => {
                                setPriority(priority+1);
                            }}
                        >
                            <FontAwesomeIcon icon={faCaretDown}/>
                        </button> 
                        <div className="d-inline-block p-2 bg-secondary text-white mr-2 mb-1">
                            {["important", "medium", "minor"][priority]}
                        </div>
                        <button className="btn btn-sm btn-outline-secondary mr-2" disabled={priority<=0}
                            onClick={() => {
                                setPriority(priority-1);
                            }}
                        >
                            <FontAwesomeIcon icon={faCaretUp}/>
                        </button>
                    </div>
                    <div className="col small d-flex justify-content-center">
                        <button className="btn btn-sm btn-outline-primary mr-2" disabled={taskState<=0}
                            onClick={() => {
                                setTaskState(taskState-1);
                            }}
                        >
                            <FontAwesomeIcon icon={faAngleLeft}/>
                        </button>    
                        <div className="d-inline-block p-2 bg-primary text-white mr-2">
                            {["todo", "in progress", "done"][taskState]}
                        </div>
                        <button className="btn btn-sm btn-outline-primary mr-2" disabled={taskState>=2}
                            onClick={() => {
                                setTaskState(taskState+1);
                            }}
                        >
                            <FontAwesomeIcon icon={faAngleRight}/>
                        </button>
                    </div>
                </div>               
            </div>
            <NavLink to={"/task/" + props.task.id}>
                <div className="card-body bg-warning">                           
                    <h5 className="card-title text-dark">{props.task.title}</h5>
                    {(new Date(props.task.due)<Date.now() ?
                        <div className="text-white bg-danger d-inline-block p-1">Expired</div>
                        :
                        (props.task.isdue ?
                            <p className="text-dark small">{props.task.due.split("T")[0]} {props.task.due.split("T")[1].split(":")[0]}:{props.task.due.split("T")[1].split(":")[1]}</p>
                            :
                            ""
                        )
                    )}
                </div>
            </NavLink>
            <div className="card-footer">
                <div className="d-flex justify-content-center">
                        <button className="btn btn-sm btn-warning mr-2 text-white"
                            onClick={() => {props.setSelectedTaskId("");}}
                        >
                            <FontAwesomeIcon icon={faTimes}/>
                        </button>
                        <button className="btn btn-sm btn-warning mr-2 text-white"
                            onClick={(e) => {
                                e.persist();
                                e.preventDefault();
                                fetch(`${process.env.REACT_APP_BACKEND_URL}/api/tasks/${props.task.id}`, {
                                    method: "PUT",
                                    credentials: "include",
                                    body: JSON.stringify({
                                        title: props.task.title,
                                        priority: priority,
                                        info: props.task.info,
                                        taskstate: taskState,
                                        due: props.task.due,
                                        isdue: props.task.isdue
                                    })
                                })
                                .then(() => {
                                    props.fetchTasks();
                                    props.setSelectedTaskId("");
                                })
                                .catch(console.log);
                                }}
                        >
                            <FontAwesomeIcon icon={faCheck}/>
                        </button>
                </div>
            </div>
        </div>
    );
}

export function DefaultCard(props){
    const [isDelete, setDelete] = useState(false);

    return (
        <div key={props.task.id} className="card w-100 d-inline-block m-1 p-2" key={props.task.id}>
            {isDelete ? (
                <Modal onApproved={async () => {
                    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/tasks/${props.task.id}`, {method: "DELETE"});           
                    props.fetchTasks();
                    }}
                    onClosed={() => setDelete(false)}>
                    {"Do you want to delete the task named " + props.task.title + "?"}
                </Modal>
                ) : (
                ""
            )}
            <div className={"card-header" + (props.editMode ? "" : " collapse")}>
                <div className="small d-inline-block p-2 bg-secondary text-white mr-2 mb-1">
                    {["important", "medium", "minor"][props.task.priority]}
                </div>
                <div className="small d-inline-block p-2 bg-primary text-white mr-2">
                    {["todo", "in progress", "done"][props.task.taskstate]}
                </div>
            </div>
            {props.selectedTaskId === "" ?
                <NavLink to={"/task/" + props.task.id} className="text-decoration-none">
                    <div className={"card-body " + ["bg-primary", "bg-info", "bg-secondary"][props.task.priority]}
                        style={{opacity: [0.6, 0.8, 1][props.task.taskstate]}}
                        data-toggle="tooltip" title={["important", "medium", "minor"][props.task.priority] + " - " + ["todo", "in progress", "done"][props.task.taskstate]}
                    >                                            
                        <h5 className="card-title text-white">{props.task.title}</h5>
                        {(new Date(props.task.due)<Date.now() ?
                            <div className="text-white bg-danger d-inline-block p-1">Expired</div>
                            :
                            (props.task.isdue ?
                                <p className="text-white small">{props.task.due.split("T")[0]} {props.task.due.split("T")[1].split(":")[0]}:{props.task.due.split("T")[1].split(":")[1]}</p>
                                :
                                ""
                            )
                        )}
                    </div>
                </NavLink>
                :
                <div className={"card-body " + ["bg-primary", "bg-info", "bg-secondary"][props.task.priority]} style={{opacity: [0.6, 0.8, 1][props.task.taskstate]}}>                                            
                    <h5 className="card-title text-white">{props.task.title}</h5>
                    {(new Date(props.task.due)<Date.now() ?
                        <div className="text-white bg-danger d-inline-block p-1">Expired</div>
                        :
                        (props.task.isdue ?
                            <p className="text-white small">{props.task.due.split("T")[0]} {props.task.due.split("T")[1].split(":")[0]}:{props.task.due.split("T")[1].split(":")[1]}</p>
                            :
                            ""
                        )
                    )}
                </div>
            }
            <div className={"card-footer" + (props.editMode && props.selectedTaskId === "" ? "" : " collapse")}>
                <div className="d-flex justify-content-center">
                    <NavLink to={"/edit-task/" + props.task.id}>
                        <button className="btn btn-sm btn-outline-primary mr-2">
                            <FontAwesomeIcon icon={faPencilAlt}/>
                        </button>
                    </NavLink>
                    <button className="btn btn-sm btn-outline-primary mr-2"
                        onClick={() => {
                            setDelete(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faTrash}/>
                    </button>
                    <button className="btn btn-sm btn-outline-primary mr-2"
                        onClick={() => props.setSelectedTaskId(props.task.id)}
                    >
                        <FontAwesomeIcon icon={faArrowsAlt}/>
                    </button>
                </div>
            </div>
        </div>
    );
}