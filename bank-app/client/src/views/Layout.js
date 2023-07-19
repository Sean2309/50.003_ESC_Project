import { Outlet, Link} from "react-router-dom";

const Layout = () => {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="marketplace">Marketplace</Link>
                    </li>
                    <li>
                        <Link to="Login">Login</Link>
                    </li>
                    {/* <li>
                        <Link to="deprecatedTransferPage">deprecatedTransferPage</Link>
                    </li> 
                    <li>
                        <Link to="RewardCenter">RewardCenter</Link>
                    </li>*/}

                </ul>

            </nav>
            <Outlet/>
        </>
    )
};

export default Layout;