import React from "react";
import { Route, Routes } from "react-router-dom";
import { ROUTERS } from "./utils/router";
import MasterLayout from "./pages/users/theme/masterLayout";
import HomePage from "./pages/users/home"
import PhimDanhuc from "./pages/users/phimdanhmuc";
import Phim from "./pages/users/phim";
import History from "./pages/users/history";
import Setting from "./pages/users/setting";
import Login from './pages/admin/login';
import UserAdmin from './pages/admin/users';
import Register from './pages/admin/register';
import ManageAdmin from './pages/admin/manage';
import FavoritePage from './pages/users/favorite';

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
        },
        {
            path: ROUTERS.USER.FAVORITE,
            component: <FavoritePage />
        }
    ];

    const adminRouters = [
        {
            path: ROUTERS.ADMIN.LOGIN,
            component: <Login />
        },
        {
            path: ROUTERS.ADMIN.USERS,
            component: <UserAdmin />
        },
        {
            path: "/register",
            component: <Register />
        },
        {
            path: "/admin/manage",
            component: <ManageAdmin />
        }
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
