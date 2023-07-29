import React, {Suspense} from 'react';
import {Link, Outlet} from "react-router-dom";

const Dashboard = () => {
    return (
        <div className="dashboard">
            <div>
                <h4 className="text-gray-100">Dashboard</h4>
                <ul className="m-0 p-0">
                    <li className="font-medium text-sm list-none py-2">
                        <Link to="/dashboard/product-list">Product List</Link>
                    </li>
                    <li className="font-medium text-sm list-none py-2">
                        <Link to="/dashboard/attributes">Attributes</Link>
                    </li>
                </ul>
            </div>
            <div className="w-full">
                <Suspense fallback={<h1>Admin Dashboard Outlet loading</h1>}>
                    <Outlet/>
                </Suspense>
            </div>
        </div>
    );
};

export default Dashboard;
