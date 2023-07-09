import React from 'react';
import {Link, Outlet} from "react-router-dom";

const Dashboard = () => {
    return (
        <div className="dashboard">
            <div>
                <h4 className="text-gray-100">Dashboard</h4>

                <ul>
                    <li>
                        <Link to="/dashboard/attributes">Attributes</Link>
                    </li>
                </ul>

            </div>

            <div className="w-full">
                <Outlet />
            </div>

        </div>
    );
};

export default Dashboard;