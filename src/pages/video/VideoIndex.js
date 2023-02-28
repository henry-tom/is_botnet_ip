import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { retrieveVideos, setVideo } from './videoSlice';
import { Navbar } from '../../components/Navbar';
import store from '../../app/store';
import IPService from '../../services/IPService';
export function VideoIndex() {

  let navigate = useNavigate();
  const videoState = useSelector((state) => state.videos);
  async function fetchData() {
    await store.dispatch(retrieveVideos());
  }
  useEffect(() => {
    fetchData();
    IPService.saveUserInfo();
  }, []);

  const handleClick = async (item) => {
    await store.dispatch(setVideo(item));
    navigate(`/videos/${item.id}`);
  };

  return (
    <div className='container mx-auto'>
      <Navbar></Navbar>
      <div className='grid md:grid-cols-3 gap-4 sm:grid-cols-1'>
        {videoState.videos?.map((item) => (
          <div
            key={item.id}
            style={{ display: 'inline-block' }}
            className='px-3'
          >
            <img
              className='rounded-lg'
              src={item.urlThumb}
              alt='null'
              width='100%'
              height='auto'
              onClick={() => handleClick(item)}
            ></img>
            <div id={item.id} value={item}>
              <h4 className='font-bold' style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>{item.name}</h4>
              <span>{item.user.name}</span>{' '}
              <span className='italic'>{item.views} views</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
