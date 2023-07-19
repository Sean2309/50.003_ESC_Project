import React from 'react';
import rewardCenterBG from "../img/RewardCenter-bg.png";
import { Link } from 'react-router-dom';

// don't forget to edit layout to add in the direct bullet link point

const baselineAlign = {
    display: 'flex',
    flexDirection: 'row'
}

const element = {
    flex: 1,
    color: 'white', 
    fontSize: 48,
    fontFamily: 'Montserrat', 
    fontWeight: '600', 
    textTransform: 'uppercase', 
    lineHeight: 20,

}

function RewardCenter() {
  return (
    <div className="rewardCenterBG" style={{width: 1440, height: 1024, position: 'relative', backgroundImage: `url(${rewardCenterBG})`}}>
      <div className="User" style={{baselineAlign, top: 31}}>
        <div className="BankLogo" style={{element, width: 425, height: 182, left: 508, top: 31, position: 'relative', background: '#73BED3'}} />
        <div className="Profile" style={{element}}>PROFILE</div>
        <div className="Back" style={{element}}>BACK</div>
      </div>


      {/* // TODO: turn membership box into a component that you can pass details into
// aka currently this is just visual placeholder, kinda sadge */}
      <div className="Rectangle" style={{width: 1000, height: 62.75, left: 200, top: 676.58, position: 'absolute'}}>
        <Link to="/transferPage">
            <button type="button" style={{width: 500, position: 'relative', background: 'white', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.30)', borderRadius: 4}}>
                <p>Open AAA membership</p>
            </button>
        </Link>
        <Link to="/transferPage">
            <button type="button" style={{width: 500, position: 'relative', background: 'white', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.30)', borderRadius: 4}}>
                <p>Open AAA membership</p>
            </button>
        </Link>
        <Link to="/transferPage">
            <button type="button" style={{width: 500, position: 'relative', background: 'white', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.30)', borderRadius: 4}}>
                <p>Open AAA membership</p>
            </button>
        </Link>
        <Link to="/transferPage">
            <button type="button" style={{width: 500, position: 'relative', background: 'white', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.30)', borderRadius: 4}}>
                <p>Open AAA membership</p>
            </button>
        </Link>
      </div>
    </div>

  );
}

export default RewardCenter;