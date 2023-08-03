import PropTypes from 'prop-types';
import React, { Component } from 'react';
import axios from 'axios';
import LoyaltyProgram from './LoyaltyProgram';

class LoyaltyPrograms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loyaltyProgramsData: [],
      userProfile: {},
    };
  }

  componentDidMount() {
    this.getLoyaltyPrograms();
    this.getUserProfile();
  }

  getLoyaltyPrograms = async () => {
    try {
      const loyaltyProgramsQueryResponse = await axios.get('http://localhost:3001/api/loyaltyprograms');
      const loyaltyProgramsQueryData = loyaltyProgramsQueryResponse.data?.loyaltyPrograms || [];
      this.setState({ loyaltyProgramsData: loyaltyProgramsQueryData });
    } catch (error) {
      console.error('Error fetching loyalty programs:', error);
    }
  };

  getUserProfile = async () => {
    try {
      const userProfileQueryResponse = await axios.get('http://localhost:3001/api/userprofile', { withCredentials: true}); // added withCredentials
      const userProfileQueryData = userProfileQueryResponse.data || {};
      this.setState({ userProfile: userProfileQueryData });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  renderLoyaltyPrograms() {
    const { loyaltyProgramsData, userProfile } = this.state;

    const componentsArray = [];

    // Add in header sentence for number of points
    componentsArray.push(
      <p key="pointsHeader">
        You currently have
        {' '}
        {userProfile.abcPoints}
        {' '}
        abcPoints
        {' '}
      </p>,
    );

    /*
            logic to pass on to actual render: if getLoyaltyPrograms is not yet successful,
            render Loading... else pass each data to a LoyaltyProgram component
        */
    if (loyaltyProgramsData === [] || userProfile === {}) {
      return (<p>Loading...</p>);
    }

    loyaltyProgramsData.map((loyaltyProgramData) => (
      componentsArray.push(
        <LoyaltyProgram
          key={loyaltyProgramData.programId}
          loyaltyProgramData={loyaltyProgramData}
          userProfile={userProfile}
        />,
      )
    ));

    return componentsArray;
  }

  render() {
    return (
      <div>
        <div className="marketplace-page-bg" data-testid="loyaltyprograms-test">
          <h2>Loyalty Programs</h2>
          {this.renderLoyaltyPrograms()}
        </div>

      </div>
    );
  }
}

LoyaltyPrograms.propTypes = {
  userId: PropTypes.number.isRequired,
};

export default LoyaltyPrograms;
