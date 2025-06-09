import React from "react";
import { Route, Routes } from "react-router-dom";
import { ROUTERS } from "./utils/router";
import MasterLayout from "./pages/users/theme/masterLayout";
import HomePage from "./pages/users/home"
import PhimDanhuc from "./pages/users/phimdanhmuc";
import Phim from "./pages/users/phim";
import History from "./pages/users/history";
import Setting from "./pages/users/setting";

const RenderUserRouter = () => {
    const userRouters = [
        {
            path: ROUTERS.USER.HOME,
            component: <HomePage />
        },
        {
            path: `${ROUTERS.USER.PHIMDM(':slug')}`,
            component: <PhimDanhuc />
        },
        {
            path: `${ROUTERS.USER.PHIM(':name')}`,
            component: <Phim />
        },
        {
            path: ROUTERS.USER.HISTORY,
            component: <History />
        },
        {
            path: "setting",
            component: <Setting />
        }
    ];

    const adminRouters = [
        
    ];

    const allRouters = [...userRouters, ...adminRouters];

    return (
        <MasterLayout>
            <Routes>
                {
                    allRouters.map((item, key) => (
                        <Route key={key} path={item.path} element={item.component} />
                    ))
                }
            </Routes>
        </MasterLayout>
    );
};

const RouterCustom = () => {
    return <RenderUserRouter />;
};

export default RouterCustom;
