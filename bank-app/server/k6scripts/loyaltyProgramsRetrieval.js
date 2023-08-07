
import { check } from "k6";
import http from "k6/http";

/* 
this script aims to test the POST transaction from frontend to 
bankapp to validate membershipId, transaction submissions etc
*/

const main = () => {
  const url = 'http://localhost:3001/api/loyaltyprograms';

  let response = http.get(url);
    
  check(response, {
    "is status 200": (r) => r.status === 200
  });

}


export default function() {
  main();
};