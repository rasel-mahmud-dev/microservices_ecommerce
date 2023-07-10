import {Outlet} from "react-router-dom";
import {Suspense} from "react";

const HomeLayout = () => {
    return (
        <div>
            <Suspense fallback={<h1>Public route Outlet loading</h1>}>
                <Outlet/>
            </Suspense>
        </div>
    );
};

export default HomeLayout;