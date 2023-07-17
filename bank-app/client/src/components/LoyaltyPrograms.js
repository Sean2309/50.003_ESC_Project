import React, { Component } from 'react';
import axios from 'axios';
import LoyaltyProgram from './LoyaltyProgram';

class LoyaltyPrograms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loyaltyProgramsData: [],
        };
    }

    getLoyaltyPrograms = async () => {
        const loyaltyProgramsQueryResponse = await axios.get('http://localhost:3001/api/loyaltyPrograms');
        const loyaltyProgramsQueryData = loyaltyProgramsQueryResponse.data.loyaltyPrograms;
        this.setState({ loyaltyProgramsData: loyaltyProgramsQueryData });
    }

    componentDidMount() {
        this.getLoyaltyPrograms();
    }
    
    /* 
        logic to pass on to actual render: if getLoyaltyPrograms is not yet successful,
        render Loading... else pass each data to a LoyaltyProgram component
    */ 
    
    renderLoyaltyPrograms() {
        const { loyaltyProgramsData } = this.state;
        
        if (loyaltyProgramsData === undefined) {
            return <p>Loading...</p>;
        }
        
        return loyaltyProgramsData.map((data, index) => (
            <LoyaltyProgram key={index} data={data} />
        ));
    }

    render() {
        return (
            <div>
                <h2>Loyalty Programs</h2>
                {this.renderLoyaltyPrograms()}
            </div>
        );
    }
}

export default LoyaltyPrograms;
