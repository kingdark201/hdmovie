export const ROUTERS = {
    USER: {
        HOME: '',
        PHIMDM: (category) => `danh-muc/${category}`,
        PHIM: (name) => `film/${name}`,
        HISTORY: 'history', // Thêm route lịch sử
    },
    ADMIN: {
        
    }
}