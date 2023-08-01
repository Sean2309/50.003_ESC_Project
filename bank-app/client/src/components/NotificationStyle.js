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
        let messageBody = message.messageBody;
        let messageType = message.messageType;
        this.notificationStyles(messageBody, messageType)
    };

    notificationStyles(message, messageType) {
        //0 for outcomeCode
        if (messageType == 0){
            new Notification('Transaction Outcome', {
                body: "Transaction Outcome: " + message
                //icon: "path/to/icon.png",
              });
        } 
        else { 
            new Notification('Transaction Outcome', {
                body: message
            });
        };
    }


    render() {
        return null;
    }
    
}

export default NotificationStyle;