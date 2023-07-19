import React, { Component } from 'react';
import axios from 'axios';
import LoyaltyProgram from './LoyaltyProgram';

class LoyaltyPrograms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loyaltyProgramsData: [],
            userProfile: {}
        };
    }

    getLoyaltyPrograms = async () => {
        const loyaltyProgramsQueryResponse = await axios.get('http://localhost:3001/api/loyaltyPrograms');
        const loyaltyProgramsQueryData = loyaltyProgramsQueryResponse.data.loyaltyPrograms;
        this.setState({ loyaltyProgramsData: loyaltyProgramsQueryData });
    }

    getUserProfile = async () => {
        const { userId } = this.props;
        const userProfileQueryResponse = await axios.get('http://localhost:3001/api/userprofile', { params: { id: userId } });
        const userProfileQueryData = userProfileQueryResponse.data;

        this.setState({ userProfile: userProfileQueryData });
    }

    componentDidMount() {
        this.getLoyaltyPrograms();
        this.getUserProfile();
    }


    renderLoyaltyPrograms() {
        const { loyaltyProgramsData, userProfile } = this.state;

        const componentsArray = [];

        // Add in header sentence for number of points
        componentsArray.push(<p key={'pointsHeader'}>You currently have {userProfile.abcPoints} abcPoints </p>)

        /* 
            logic to pass on to actual render: if getLoyaltyPrograms is not yet successful,
            render Loading... else pass each data to a LoyaltyProgram component
        */
        if (loyaltyProgramsData === [] || userProfile === {}) {
            return (<p>Loading...</p>);
        }

        loyaltyProgramsData.map((loyaltyProgramData, index) => (
            componentsArray.push(
                <LoyaltyProgram
                    key={`loyaltyProgram${index}`}
                    loyaltyProgramData={loyaltyProgramData}
                    userProfile={userProfile}
                />
            )
        ));

        return componentsArray;

    }

    render() {
        return (
            <div>
                <div className='marketplace-page-bg'>
                    <h2>Loyalty Programs</h2>
                    {this.renderLoyaltyPrograms()}
                </div>

            </div>
        );
    }
}

export default LoyaltyPrograms;
