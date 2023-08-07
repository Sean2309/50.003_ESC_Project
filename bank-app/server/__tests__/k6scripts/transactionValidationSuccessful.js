import { check } from "k6";
import http from "k6/http";

/* 
this script aims to test the POST transaction from frontend to 
bankapp to validate membershipId, transaction submissions etc
*/

const login = () => {
  const url = 'http://localhost:3001/login';

  const loginId = 'john123'
  const password = 'password'
  
  let response = http.post(url, JSON.stringify({ loginId, password }), { headers: {'Content-Type': 'application/json' } } );
  
  let jar = http.cookieJar();
  let cookies = jar.cookiesForURL(response.url);    
  
  return cookies.token;

}


const main = (token) => {
  const url = 'http://localhost:3001/api/transferformsubmit/ASIAMILES';

  const mockTransactionData = {
    memberName: "MockUser",
    membershipId: "12345678990",
    transferDate: "11-11-11",
    transferAmount: 0,
    notificationMethod: "1",
    emailAddress: "Mock@email.com",
    phoneNumber: "88100110",
    partnerCode: "DBSSG"
  };
  

  // Send the request with the authentication cookie
  
  let response = http.post(url, JSON.stringify(mockTransactionData), { headers: {'Content-Type': 'application/json' }, cookies: { token: token} } );

  check(response, {
    "is status 201": (r) => r.status === 201
  });

}

export function setup() {
  const token = login();
  return token;
}


export default function(data) {
  main(data);
};