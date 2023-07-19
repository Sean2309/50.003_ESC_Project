import React from 'react';
import TransferForm from '../components/TransferForm';
import transferBG from "../img/Transfer-bg.png";
import { Link } from 'react-router-dom';

function TransferPage() {
  return (
    <div className="TransferBG" style={{width: 1440, height: 1024, position: 'relative', backgroundImage: `url(${transferBG})`}}>
      <div className="User" style={{left: 505.62, top: 200.20, position: 'absolute'}}>
      <h1>Transfer Page</h1>
      <TransferForm />
      </div>
      
      <div className="Rectangle" style={{width: 1000, height: 62.75, left: 480, top: 676.58, position: 'absolute'}}>
        <Link to="/">
            <button type="button" style={{width: 500, position: 'relative', background: 'white', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.30)', borderRadius: 4}}>
                <p>Save Membership</p>
            </button>
        </Link>
      </div>
    </div>

  );
}

export default TransferPage;
