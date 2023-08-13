
import { check } from "k6";
import http from "k6/http";

/* 
this script aims to test the POST transaction from frontend to 
bankapp to validate membershipId, transaction submissions etc
*/


const loginAndSubmit = () => {
    const url = 'http://localhost:3001/login';

    const loginId = 'john123'
    const password = 'password'

    const response = http.post(url, JSON.stringify({ loginId, password }), { headers: { 'Content-Type': 'application/json' } });



    let jar = http.cookieJar();
    let cookies = jar.cookiesForURL(response.url);
    const token = cookies.token;

    const url2 = 'http://localhost:3001/api/transferformsubmit/ASIAMILES';


    const mockTransactionData = {
        memberName: "MockUser",
        membershipId: "12345678990",
        transferDate: "11-11-11",
        transferAmount: 0,
        notificationMethod: "1",
        emailAddress: "Mock@email.com",
        phoneNumber: "88100110",
        partnerCode: "DBSSG",
        userId:"1"
    };


    // Send the request with the authentication cookie

    let response2 = http.post(url2, JSON.stringify(mockTransactionData), { headers: { 'Content-Type': 'application/json' }, cookies: { token: token } });

    return JSON.parse(response2.body);

}

const main = (transaction) => {

    // URL with query parameters
    const url = 'http://localhost:3001/api/webhook/DBSSG/ASIAMILES';

    transaction.outcomeCode = '0001';

    // Send the request with the authentication cookie

    let response = http.post(url, JSON.stringify([transaction]), { headers: { 'Content-Type': 'application/json' } });

    check(response, {
        "is status 201": (r) => r.status === 201
    });

}

export function setup() {
    const transaction = loginAndSubmit();
    return transaction;
}


export default function (data) {
    main(data);
};