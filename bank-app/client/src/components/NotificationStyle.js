import React, { Component } from 'react';


class NotificationStyle extends Component{
    
    constructor() {
        super();
        this.showNotification = this.showNotification.bind(this);
    }

    componentDidMount() {
        if (!("Notification" in window)) {
            console.log("Browser does not support desktop notification");
        } else {
            Notification.requestPermission().then(function(permission) {
                 console.log('permiss', permission);
                });
    };
    }

    showNotification() {
        new Notification('Status message');
    }

    render() {
        return (
        <div>
            <button onClick={this.showNotification}>Show notification</button></div>
        );
    }
}

export default NotificationStyle;