import axios from 'axios';
import { channelFilter } from './filter.js';

const API_KEY = "AIzaSyC6jkYbmIXdlyjsTYIN31DQQ8cMR1HhD1M";
const BASE_URL = "https://www.googleapis.com/youtube/v3";

const call = "commentThreads";
const settings = {
  "part": "replies,snippet",
  "maxResults": "100",
};

export async function getFilteredThreads(video = "SwSbnmqk3zY", user, page) {
  settings["videoId"] = video;
  let url = `${BASE_URL}/${call}?key=${API_KEY}`;
  Object.entries(settings).forEach(
    ([key, value]) => url += `&${key}=${value}`
  );
  if (page) {
    url += `&pageToken=${page}`;
  }
  
  try {
    const response = await axios.get(url);
    const data = response.data;

    // const filtered = data.items;
    const filtered = channelFilter(data.items, user);
    const nextPage = Object.hasOwn(data, "nextPageToken") ? data.nextPageToken : -1;
    const result = { data: filtered, next: nextPage };
    return result;
  } catch (error) {
    console.log(error);
  }
}

