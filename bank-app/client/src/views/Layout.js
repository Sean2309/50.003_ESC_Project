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
                        <Link to="Transactions">Transactions</Link>
                    </li>

                </ul>

            </nav>
            <Outlet/>
        </>
    )
};

export default Layout;