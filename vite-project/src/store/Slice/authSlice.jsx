import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { API_BASE_URL } from "../../config/apiConfig";

// Backend URL
const API_URL = `${API_BASE_URL}/auth/`;

const USER_KEY = "user";

// helpers
const saveUser = (u) => localStorage.setItem(USER_KEY, JSON.stringify(u));
const loadUser = () => {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    const userData = JSON.parse(userStr);

    if (userData?.token) {
      const base64Url = userData.token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decodedUser = JSON.parse(jsonPayload);
      if (decodedUser?.exp * 1000 < Date.now()) {
        localStorage.removeItem(USER_KEY);
        return null;
      }
    }
    return userData;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};
const clearUser = () => localStorage.removeItem(USER_KEY);

// thunks
export const signup = createAsyncThunk(
  "auth/signup",
  async ({ name, email, password, role }, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL + "signup", {
        name,
        email,
        password,
        role
      });

      const userObj = {
        name: response.data.user.name,
        email: response.data.user.email,
        uid: response.data.user.id,
        _id: response.data.user.id,
        role: response.data.user.role,
        token: response.data.token
      };

      saveUser(userObj);
      return userObj;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || err.message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL + "login", {
        email,
        password
      });

      const userObj = {
        name: response.data.user.name,
        email: response.data.user.email,
        uid: response.data.user.id,
        _id: response.data.user.id,
        role: response.data.user.role,
        token: response.data.token
      };

      saveUser(userObj);
      return userObj;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || err.message);
    }
  }
);

export const telegramLogin = createAsyncThunk(
  "auth/telegramLogin",
  async (initData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL + "telegram/login", { initData });

      const userObj = {
        name: response.data.user.name,
        email: response.data.user.email,
        uid: response.data.user.id,
        _id: response.data.user.id,
        role: response.data.user.role,
        token: response.data.token
      };

      saveUser(userObj);
      return userObj;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || err.message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  clearUser();
  return true;
});

// Token tekshiruvi - app yuklanganida
export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (_, { rejectWithValue }) => {
    try {
      const userData = loadUser();
      if (!userData?.token) return rejectWithValue("No token");
      // Token bor va expired emas - foydalanuvchini qaytaramiz
      return userData;
    } catch {
      clearUser();
      return rejectWithValue("Invalid token");
    }
  }
);

// Profile yangilash
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.user?.token;
      const response = await axios.put(API_URL + "profile", userData, {
        headers: { "x-auth-token": token },
      });

      const userObj = {
        name: response.data.user.name,
        email: response.data.user.email,
        uid: response.data.user.id,
        _id: response.data.user.id,
        role: response.data.user.role,
        token: token // preserve token
      };

      saveUser(userObj);
      return userObj;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || err.message);
    }
  }
);

// Hisobni o'chirish
export const deleteAccount = createAsyncThunk(
  "auth/deleteAccount",
  async (password, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.user?.token;
      await axios.delete(API_URL + "delete-account", {
        headers: { "x-auth-token": token },
        data: { password }
      });
      clearUser();
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || err.message);
    }
  }
);

const storedUser = loadUser();

const initialState = {
  user: storedUser,
  isAuthenticated: !!storedUser,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // signup
    builder.addCase(signup.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    builder.addCase(signup.fulfilled, (s, { payload }) => {
      s.loading = false;
      s.user = payload;
      s.isAuthenticated = true;
    });
    builder.addCase(signup.rejected, (s, { payload }) => {
      s.loading = false;
      s.error = payload || "Sign up failed";
    });

    // login
    builder.addCase(login.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    builder.addCase(login.fulfilled, (s, { payload }) => {
      s.loading = false;
      s.user = payload;
      s.isAuthenticated = true;
    });
    builder.addCase(login.rejected, (s, { payload }) => {
      s.loading = false;
      s.error = payload || "Login failed";
    });

    // telegramLogin
    builder.addCase(telegramLogin.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    builder.addCase(telegramLogin.fulfilled, (s, { payload }) => {
      s.loading = false;
      s.user = payload;
      s.isAuthenticated = true;
    });
    builder.addCase(telegramLogin.rejected, (s, { payload }) => {
      s.loading = false;
      s.error = payload || "Telegram login failed";
    });

    // verifyToken
    builder.addCase(verifyToken.fulfilled, (s, { payload }) => {
      s.user = payload;
      s.isAuthenticated = true;
    });
    builder.addCase(verifyToken.rejected, (s) => {
      s.user = null;
      s.isAuthenticated = false;
    });

    // logout
    builder.addCase(logout.pending, (s) => {
      s.loading = true;
    });
    builder.addCase(logout.fulfilled, (s) => {
      s.user = null;
      s.isAuthenticated = false;
      s.loading = false;
      s.error = null;
    });
    builder.addCase(logout.rejected, (s, { payload }) => {
      s.loading = false;
      s.error = payload || "Logout failed";
    });

    // updateProfile
    builder.addCase(updateProfile.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    builder.addCase(updateProfile.fulfilled, (s, { payload }) => {
      s.loading = false;
      s.user = payload;
    });
    builder.addCase(updateProfile.rejected, (s, { payload }) => {
      s.loading = false;
      s.error = payload || "Update profile failed";
    });

    // deleteAccount
    builder.addCase(deleteAccount.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    builder.addCase(deleteAccount.fulfilled, (s) => {
      s.loading = false;
      s.user = null;
      s.isAuthenticated = false;
    });
    builder.addCase(deleteAccount.rejected, (s, { payload }) => {
      s.loading = false;
      s.error = payload || "Delete account failed";
    });
  },
});

export default authSlice.reducer;
