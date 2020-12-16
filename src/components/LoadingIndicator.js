import React from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import Loader from 'react-loader-spinner';
import './LoadingIndicator.css';

const LoadingIndicator = (props) => {
  const { promiseInProgress } = usePromiseTracker();
  return (
    promiseInProgress &&
    <div className="load-bar">
      <Loader type="Puff" color="#0079d3" height="60" width="60" />
    </div>
  );
}

export default LoadingIndicator;