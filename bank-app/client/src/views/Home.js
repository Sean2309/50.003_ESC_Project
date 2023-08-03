import NotificationLogic from "../components/NotificationLogic";

const Home = () => {
    return (
    <div>
        <h1>Home</h1>
        <NotificationLogic />
        <input type="text" id="transferAmountText" />
        <input type="text" id="loyaltyProgramNameText" />
        <button id="resendNotif" onClick="handleButtonClick()">Resend Notif</button>
    </div>

    );
};

export default Home;