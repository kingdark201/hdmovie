import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginApi } from './services/authServices';

// Lấy dữ liệu từ localStorage nếu có
const savedToken = localStorage.getItem('authToken');
const savedUser = localStorage.getItem('authUser');
const initialState = {
  token: savedToken || null,
  user: savedUser ? JSON.parse(savedUser) : null,
  error: null,
  isAuthenticated: !!savedToken,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, thunkAPI) => {
    try {
      const data = await loginApi(username, password);
      console.log('Login API response:', data); // Thêm dòng này để debug
      if (data && data.token) {
        // Đảm bảo user object có _id hoặc id
        let userObj = data.user;
        if (!userObj) {
          userObj = {};
          if (data.id) userObj._id = data.id;
          if (data.name) userObj.name = data.name;
          if (username) userObj.username = username;
        }
        // Nếu userObj không có _id nhưng có id thì gán _id = id
        if (!userObj._id && userObj.id) userObj._id = userObj.id;
        // Lưu vào localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('authUser', JSON.stringify(userObj));
        return {
          token: data.token,
          user: userObj,
        };
      } else {
        return thunkAPI.rejectWithValue(data.error || 'Sai tài khoản hoặc mật khẩu');
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Lỗi đăng nhập');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      // Xóa localStorage khi logout
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
