import React from "react";
import Countdown from 'react-countdown';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDizzy} from "@fortawesome/free-solid-svg-icons";

export function Modal({ onClosed, onApproved, children }) {
    return (
        <div className="modal d-block">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Delete</h5>
                        <button type="button" className="close" aria-label="Close" onClick={onClosed}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={onApproved}>
                            Delete
                            </button>
                        <button type="button" className="btn btn-secondary" onClick={onClosed}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function Spinner() {
    return(
        <div className="p-5  m-auto text-center content">
            <div className="spinner-border"></div>
        </div>
    );
}

export function CantFind() {
    const Completionist = () => 
    <div className="p-5 m-auto content">
        <div className="card p-3 mb-3 mt-3 text-center">
            <h2><FontAwesomeIcon icon={faDizzy} className="mr-2"/></h2>
            <h3>Sorry, this task doesn't exist.</h3>
        </div>
    </div>;
    const renderer = ({completed}) => {
        if (completed) {
            return <Completionist />;
        } else {
            return(
                <Spinner/>
            );
        }
    };
    
    return(
        <Countdown date={Date.now() + 2000} renderer={renderer}/>
    );
}