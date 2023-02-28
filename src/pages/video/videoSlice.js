import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import VideoService from "../../services/VideoService";

export const videoState = {
  video: {},
  comments: [],
  suggestionVideos: [],
  videos: [],
  categories: [],
};
///////////////////ACTIONS OF REDUX///////////////////////
export const retrieveVideos = createAsyncThunk(
  "videos/retrieve",
  async (_, { getState }) => {
    // const state = getState();
    // console.log("------state", state.auth);
    const response = await VideoService.getAll();
    return response;
  }
);

export const retrieveCategories = createAsyncThunk(
  "categories/retrieve",
  async () => {
    const response = await VideoService.getAllCategories();
    return response;
  }
);

export const getVideosByUserId = createAsyncThunk(
  "videos/retrieveByUserId",
  async (token) => {
    const response = await VideoService.getVideosByUserId(token);
    return response;
  }
);

export const deleteVideoByVideoId = createAsyncThunk(
  "videos/deleteByVideoId",
  async (videoInfo) => {
    const response = await VideoService.deleteVideoByVideoId(
      videoInfo.videoId,
      videoInfo.token
    );
    return response;
  }
);

export const adminDeleteVideoByVideoId = createAsyncThunk(
  "videos/adminDeleteByVideoId",
  async (videoInfo) => {
    const response = await VideoService.adminDeleteVideoByVideoId(
      videoInfo.videoId,
      videoInfo.token
    );
    return response;
  }
);

export const adminUpdateVideoName = createAsyncThunk(
  "videos/deleteByVideoId",
  async (videoInfo) => {
    const response = await VideoService.adminUpdateVideoName(
      videoInfo.videoId,
      videoInfo.videoName,
      videoInfo.token
    );
    return response;
  }
);

export const updateVideoName = createAsyncThunk(
  "videos/deleteByVideoId",
  async (videoInfo) => {
    const response = await VideoService.updateVideoName(
      videoInfo.videoId,
      videoInfo.videoName,
      videoInfo.token
    );
    return response;
  }
);

export const getCommentsAndSuggestionVideoBy = createAsyncThunk(
  "videos/get_comments",
  async (videoInfo) => {
    const response = await VideoService.getCommentsAndSuggestionVideoBy(
      videoInfo.videoId,
      videoInfo.categoryId
    );
    return response;
  }
);

///////////////////////////////////////////////////////////
export const videoSlice = createSlice({
  name: "videos",
  initialState: videoState,
  reducers: {
    setVideo: (state, action) => {
      state.video = action.payload;
    },
    addAnComment: (state, action) => {
      state.comments.push(action.payload);
    },
    removeAnItem: (state, action) => {
      let tmp_comment = state.comments;
      state.comments = tmp_comment.filter(
        (item) => item.id !== action.payload.id
      );
    },
    updateVideoNameReducer: (state, action) => {
      let tmp_videos = state.videos;
      state.videos = tmp_videos.map((item) => {
        if (item.id === action.payload.videoId) {
          item.name = action.payload.videoName;
        }
        return item;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(retrieveVideos.fulfilled, (state, action) => {
        state.videos = action.payload;
      })
      .addCase(getVideosByUserId.fulfilled, (state, action) => {
        state.videos = action.payload;
      })
      .addCase(retrieveCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(getCommentsAndSuggestionVideoBy.fulfilled, (state, action) => {
        state.comments = action.payload.comments;
        state.suggestionVideos = action.payload.suggestionVideos;
      });
  },
});

export const { setVideo, addAnComment, removeAnItem, updateVideoNameReducer } =
  videoSlice.actions;
export default videoSlice.reducer;
