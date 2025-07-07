import React, { useReducer, useContext, useEffect } from "react";

import reducer from "./reducer";
import axios from "axios";
import authFetch from "../config/axios";
import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  DELETE_JOB_ERROR,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,
  GET_CURRENT_USER_BEGIN,
  GET_CURRENT_USER_SUCCESS,
} from "./actions";

const initialState = {
  userLoading: true,
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  user: null,
  userLocation: "",
  showSidebar: false,
  isEditing: false,
  editJobId: "",
  position: "",
  company: "",
  jobLocation: "",
  jobTypeOptions: ["full-time", "part-time", "remote", "internship"],
  jobType: "full-time",
  statusOptions: ["interview", "declined", "pending"],
  status: "pending",
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  search: "",
  searchStatus: "all",
  searchType: "all",
  sort: "latest",
  sortOptions: ["latest", "oldest", "a-z", "z-a"],
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // axios configuration is now in config/axios.js
  // authFetch is imported from there

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  const setupUser = async ({ currentUser, endPoint, alertText }) => {
    console.log("🔐 Starting setupUser for endpoint:", endPoint);
    console.log("🔐 Current user data:", {
      email: currentUser.email,
      name: currentUser.name,
    });
    console.log("🔐 Making request to:", `/auth/${endPoint}`);

    dispatch({ type: SETUP_USER_BEGIN });
    try {
      console.log("🔐 Sending login/register request...");
      const { data } = await authFetch.post(`/auth/${endPoint}`, currentUser);

      console.log("🔐 Login/Register successful, response data:", data);
      console.log("🔐 Response headers:", data.headers);

      const { user, location } = data;
      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, location, alertText },
      });
    } catch (error) {
      console.log("❌ Login/Register failed:", error);
      console.log("❌ Error response:", error.response?.data);
      console.log("❌ Error status:", error.response?.status);
      console.log("❌ Error config:", error.config);

      // Check if it's a CORS or cookie issue
      let errorMessage =
        error.response?.data?.msg || error.message || "Something went wrong";

      if (error.message?.includes("CORS") || error.response?.status === 0) {
        errorMessage =
          "Network error: Please check if you're in incognito mode. Try using a regular browser window.";
      } else if (error.response?.status === 401) {
        errorMessage =
          "Authentication failed. Please try again or use a regular browser window if you're in incognito mode.";
      }

      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: errorMessage },
      });
    }
    clearAlert();
  };
  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const logoutUser = async () => {
    await authFetch.get("/auth/logout");
    dispatch({ type: LOGOUT_USER });
  };
  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN });
    try {
      const { data } = await authFetch.patch("/auth/updateUser", currentUser);
      const { user, location } = data;

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, location },
      });
    } catch (error) {
      if (error.response?.status !== 401) {
        const errorMessage =
          error.response?.data?.msg || error.message || "Something went wrong";
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: errorMessage },
        });
      }
    }
    clearAlert();
  };

  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
  };
  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES });
  };
  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobType, status } = state;
      await authFetch.post("/jobs", {
        position,
        company,
        jobLocation,
        jobType,
        status,
      });
      dispatch({ type: CREATE_JOB_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response?.status === 401) return;
      const errorMessage =
        error.response?.data?.msg || error.message || "Something went wrong";
      dispatch({
        type: CREATE_JOB_ERROR,
        payload: { msg: errorMessage },
      });
    }
    clearAlert();
  };

  const getJobs = async () => {
    const { page, search, searchStatus, searchType, sort } = state;

    let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`;
    if (search) {
      url = url + `&search=${search}`;
    }
    dispatch({ type: GET_JOBS_BEGIN });
    try {
      const { data } = await authFetch(url);
      const { jobs, totalJobs, numOfPages } = data;
      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: {
          jobs,
          totalJobs,
          numOfPages,
        },
      });
    } catch (error) {
      logoutUser();
    }
    clearAlert();
  };

  const setEditJob = (id) => {
    dispatch({ type: SET_EDIT_JOB, payload: { id } });
  };
  const editJob = async () => {
    dispatch({ type: EDIT_JOB_BEGIN });

    try {
      const { position, company, jobLocation, jobType, status } = state;
      await authFetch.patch(`/jobs/${state.editJobId}`, {
        company,
        position,
        jobLocation,
        jobType,
        status,
      });
      dispatch({ type: EDIT_JOB_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response?.status === 401) return;
      const errorMessage =
        error.response?.data?.msg || error.message || "Something went wrong";
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { msg: errorMessage },
      });
    }
    clearAlert();
  };
  const deleteJob = async (jobId) => {
    dispatch({ type: DELETE_JOB_BEGIN });
    try {
      await authFetch.delete(`/jobs/${jobId}`);
      getJobs();
    } catch (error) {
      if (error.response?.status === 401) return;
      const errorMessage =
        error.response?.data?.msg || error.message || "Something went wrong";
      dispatch({
        type: DELETE_JOB_ERROR,
        payload: { msg: errorMessage },
      });
    }
    clearAlert();
  };
  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN });
    try {
      const { data } = await authFetch("/jobs/stats");
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        },
      });
    } catch (error) {
      logoutUser();
    }
    clearAlert();
  };
  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS });
  };
  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: { page } });
  };

  const getCurrentUser = async () => {
    console.log("👤 Starting getCurrentUser");
    dispatch({ type: GET_CURRENT_USER_BEGIN });
    try {
      const { data } = await authFetch("/auth/getCurrentUser");
      console.log("👤 getCurrentUser successful:", data);

      const { user, location } = data;

      dispatch({
        type: GET_CURRENT_USER_SUCCESS,
        payload: { user, location },
      });
    } catch (error) {
      console.log("❌ getCurrentUser failed:", error);
      console.log("❌ Error response:", error.response?.data);
      console.log("❌ Error status:", error.response?.status);

      // Handle cases where error.response might be undefined (network errors, CORS, etc.)
      if (error.response?.status === 401) return;
      logoutUser();
    }
  };
  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        setupUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob,
        showStats,
        clearFilters,
        changePage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
