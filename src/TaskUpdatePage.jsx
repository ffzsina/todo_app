import {useHistory} from "react-router-dom";
import {useEffect, useState} from "react";
import {Spinner, CantFind} from "./Snippets";
import {finalDue} from "./TaskCreatePage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock} from "@fortawesome/free-solid-svg-icons";

export function TaskUpdatePage(props){
    const history = useHistory();
    const id = props.match.params.taskId;
    const [task, setTask] = useState({});
    const [showDate, setShowDate] = useState(true);
    const [isPending, setPending] = useState(false);

    useEffect(() => {
        setPending(true);
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}`, {credentials: "include"})
        .then((res) => res.json())
        .then(setTask)
        .catch(console.log)
        .finally((task) => {setPending(false);});
    }, []);

    useEffect(() => {
        setShowDate(task.isdue);
    }, [task]);

    if (isPending){
        return <Spinner/>;
    }

    if (!task.id){
        return <CantFind/>;
    }

    return (
        <div className="p-5  m-auto content">
            <h2>Edit task</h2>
            <form onSubmit={(e) => {
                e.persist();
                e.preventDefault();
                fetch(`${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}`, {
                    method: "PUT",
                    credentials: "include",
                    body: JSON.stringify({
                        title: e.target.elements.title.value,
                        priority: e.target.elements.priority.value,
                        info: e.target.elements.info.value,
                        taskstate: e.target.elements.taskstate.value,
                        due: finalDue(showDate, e),
                        isdue: showDate
                    })
                })
                .then(() => {history.push("/");})
                .catch(console.log);
            }}>
                <div className="card p-3 mb-3 mt-3 text-center">
                    <div className="card-header">
                        <div className="d-inline-block">
                            <h1 className="card-title">
                                <div className="form-group">
                                    <input type="text" name="title" required defaultValue={task.title} placeholder="Title" className="form-control form-control-lg"/>
                                </div>
                            </h1>
                            <hr/>
                            <div>
                                <div className="small d-inline-block p-2 bg-secondary text-white mr-2 mb-1">
                                    <div className="form-group">
                                        <select name="priority" className="form-control">
                                            <option value="0" selected={task.priority==0}>Important</option>
                                            <option value="1" selected={task.priority==1}>Medium</option>
                                            <option value="2" selected={task.priority==2}>Minor</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="small d-inline-block p-2 bg-primary text-white mr-2">
                                    <div className="form-group">
                                        <select name="taskstate" className="form-control">
                                            <option value="0" selected={task.taskstate==0}>To do</option>
                                            <option value="1" selected={task.taskstate==1}>In progress</option>
                                            <option value="2" selected={task.taskstate==2}>Done</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col mb-2">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="form-group">
                                            <h4>Due date:</h4>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" checked={!showDate} id="showDateCheck"
                                                    onChange={
                                                        showDate ? () => setShowDate(false) : () => setShowDate(true)
                                                }/>
                                                <label className="form-check-label" htmlFor="showDateCheck">
                                                    No thanks
                                                </label>
                                            </div>
                                            {showDate ?
                                                <div className={"row" + (showDate ? "" : " collapse")}>
                                                    <div className="col mb-1">
                                                        <input type="date" name="date" className="form-control" required={showDate}
                                                        defaultValue={task.due===undefined? "" :task.due.split("T")[0]} />
                                                    </div>
                                                    <div className="col">
                                                        <input type="time" name="time" className="form-control" required={showDate}
                                                        defaultValue={(
                                                            task.isdue ?
                                                            (task.due===undefined? "": task.due.split("T")[1].split(":")[0] + ":" + task.due.split("T")[1].split(":")[1])
                                                            :
                                                            ""
                                                        )}/>
                                                    </div>
                                                </div>
                                                :
                                                ""
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <h4>
                                            <FontAwesomeIcon icon={faClock} className="mr-2" />
                                        </h4>
                                        <h4>
                                            0:00:00:00
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr/>
                        <div className="form-group">
                            <textarea className="form-control" name="info" defaultValue={task.info} placeholder="Write some info..." rows="3"></textarea>
                        </div>
                    </div>
                    <div className="card-footer">
                        <button type="submit" className="btn btn-lg btn-warning">
                            Update
                        </button>
                    </div>
                </div>
            </form>           
        </div>
    );
}