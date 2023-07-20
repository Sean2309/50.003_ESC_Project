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

    showNotification(message) {
        new Notification('Transaction Outcome', {
            body: "Transaction Outcome: " + message
            //icon: "path/to/icon.png",
          });
    };

    render() {
        return null;
    }
    
    
}

export default NotificationStyle;