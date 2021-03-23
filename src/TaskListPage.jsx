import {useEffect, useState} from "react";
import {Spinner} from "./Snippets";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {SelectedCard, DefaultCard} from "./Cards";

export function TaskListPage(){
    const [tasks, setTasks] = useState([]);
    const [isPending, setPending] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState("");
    const [order, setOrder] = useState("priority");

    function fetchTasks(){
        setPending(true);
        fetch(process.env.REACT_APP_BACKEND_URL + "/api/tasks", { credentials: "include" })
        .then((res) => res.json())
        .then((tasks) => setTasks(tasks))
        .catch(console.log)
        .finally(() => {setPending(false);});
    }

    useEffect(() =>{
        fetchTasks();
    }, []);

    if (isPending) {
        return <Spinner/>;
    }

    return (
        <div className="p-5 m-auto text-center content">
            <div className={"col-md-3" + (editMode ? " collapse" : "")}>
                <div className="d-inline-block small p-1 bg-primary text-white mr-1 mb-1">Important</div>
                <div className="d-inline-block small p-1 bg-info text-white mr-1 mb-1">Medium</div>
                <div className="d-inline-block small p-1 bg-secondary text-white mr-1 mb-1">Minor</div>
            </div>
            <div className="sticky-top d-flex justify-content-end pt-2">
                <button className={"btn btn-sm" + (editMode ? " btn-outline-warning" : " btn-warning text-white")}
                    onClick={() => {
                        editMode ? setEditMode(false) : setEditMode(true);
                        setSelectedTaskId("");
                    }}
                >
                    <h3><FontAwesomeIcon icon={faEdit}/></h3>
                </button>
            </div>
            <div>
                <h2>Tasks</h2>
                <button className="btn btn-warning mb-2"
                    onClick={() => {order==="priority" ? setOrder("due date") : setOrder("priority")}}
                >
                    {"order by " + order}
                </button>
                <div className="row">
                    <div className="col-md border mb-4">
                        <h3>To do:</h3>
                        {listColumn(tasks, order, 0, selectedTaskId, setSelectedTaskId, editMode, fetchTasks, setPending)}
                    </div>
                    <div className="col-md border mb-4">
                        <h3>In progress:</h3>
                        {listColumn(tasks, order, 1, selectedTaskId, setSelectedTaskId, editMode, fetchTasks, setPending)}
                    </div>
                    <div className="col-md border mb-4">
                        <h3>Done:</h3>
                        {listColumn(tasks, order, 2, selectedTaskId, setSelectedTaskId, editMode, fetchTasks, setPending)}
                    </div>
                </div>
            </div>
        </div>
    );
}

function listColumn(tasks, order, taskState, selectedTaskId, setSelectedTaskId, editMode, fetchTasks, setPending){
    const orderByPriority = (a, b) => a.priority > b.priority ? 1 : -1;
    const orderByDate = (a, b) => new Date(a.due) > new Date(b.due) ? 1 : -1;
    let orderByFeature;
    if (order==="priority"){
        orderByFeature = orderByPriority;
    } else if (order==="due date"){
        orderByFeature = orderByDate;
    };

    return(
        <div>
            {tasks.filter((task) => task.taskstate === taskState)
            .sort(orderByFeature)
            .map((filteredTask) =>(
                selectedTaskId===filteredTask.id ?
                    <SelectedCard
                        key={filteredTask.id}
                        task={filteredTask}
                        setSelectedTaskId={setSelectedTaskId}
                        fetchTasks={fetchTasks}
                        setPending={setPending}
                    />
                    :
                    <DefaultCard
                        key={filteredTask.id}
                        task={filteredTask}
                        setSelectedTaskId={setSelectedTaskId}
                        selectedTaskId={selectedTaskId}
                        editMode={editMode}
                        fetchTasks={fetchTasks}
                    />
                ))}
        </div>
    );
}