const axios = require("axios");

class VideoService {
  async getAll() {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/videos/all`
    );
    const result = await response.json();
    return result;
  }
  async getAllCategories() {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/categories/`
    );
    const result = await response.json();
    return result;
  }
  async uploadComment(comment) {
    const token = comment.token;
    delete comment.token;
    const result = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/videos/upload-comment`,
      comment,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return result.data;
  }
  async getCommentsAndSuggestionVideoBy(videoId, categoryId) {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/videos/get-comment-and-suggestion-videos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId: videoId,
          categoryId: categoryId,
        }),
      }
    );
    const result = await response.json();
    return result;
  }
  async deleteVideoByVideoId(videoId, token) {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/videos/delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          videoId: videoId,
        }),
      }
    );
    const result = await response.json();
    return result;
  }
  async adminDeleteVideoByVideoId(videoId, token) {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/videos/admin-video-delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          videoId: videoId,
        }),
      }
    );
    const result = await response.json();
    return result;
  }
  async adminUpdateVideoName(videoId, videoName, token) {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/videos/admin-update-video-name`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          videoId: videoId,
          videoName: videoName,
        }),
      }
    );
    const result = await response.json();
    return result;
  }
  async updateVideoName(videoId, videoName, token) {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/videos/update-video-name`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          videoId: videoId,
          videoName: videoName,
        }),
      }
    );
    const result = await response.json();
    return result;
  }
  async getVideosByUserId(token) {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/videos/get-video-by-user-id`,
      {
        method: "POST",
        headers: {
          Authorization: token,
        },
      }
    );
    const result = await response.json();
    return result;
  }
}
export default new VideoService();
