export const ROUTERS = {
    USER: {
        HOME: '',
        PHIMDM: (category) => `danh-muc/${category}`,
        PHIM: (name) => `film/${name}`,
        HISTORY: 'history', // Thêm route lịch sử
        FAVORITE: 'favorite', // Thêm route phim yêu thích
    },
    ADMIN: {
        LOGIN: '/login', // Thêm route đăng nhập admin
        USERS: '/admin/users', // Thêm route quản lý user
        MANAGE: '/admin/manage', // Thêm route quản lý tổng hợp
    }
}