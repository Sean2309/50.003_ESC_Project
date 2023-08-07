import { check } from "k6";
import http from "k6/http";

/* 
this script aims to test the POST transaction from frontend to 
bankapp to validate membershipId, transaction submissions etc
*/

const main = () => {

    // URL with query parameters
    const url = 'http://localhost:3003/api/transactions/ASIAMILES';

    const mockTransactionData = {
        memberName: "MockUser",
        membershipId: "12345678990",
        transferDate: "11-11-11",
        transferAmount: 0,
        notificationMethod: "1",
        emailAddress: "Mock@email.com",
        phoneNumber: "88100110",
        partnerCode: "DBSSG",
        referenceNumber: '123049128'
    };


    // Send the request with the authentication cookie

    let response = http.post(url, JSON.stringify(mockTransactionData), { headers: { 'Content-Type': 'application/json' } });

    check(response, {
        "is status 201": (r) => r.status === 201
    });

}

export default function (data) {
    main();
};