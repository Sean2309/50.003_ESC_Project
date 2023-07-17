import NotificationStyle from "./NotificationStyle";
import React, {Component} from "react";

class NotificationLogic extends Component {
    render() {
        return (
        <div>
            <button onClick={() => new NotificationStyle().showNotification()}>Show notification</button></div>
        );
    }

}

export default NotificationLogic;