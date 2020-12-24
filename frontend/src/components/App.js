import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import Auth from '../hoc/auth';
import LandingPage from './views/LandingPage/LandingPage';
import LoginPage from './views/LoginPage/LoginPage';
import RegisterPage from './views/RegisterPage/RegisterPage';
import NavBar from './views/NavBar/NavBar';
import Footer from './views/Footer/Footer';
import UploadCourse from './views/UploadCourse/UploadCourse';
import UploadVideo from './views/UploadVideo/UploadVideo';
import CourseDetail from './views/CourseDetail/CourseDetail';
import VideoPlayer from './views/VideoPlayer/VideoPlayer';
import CourseCollection from './views/CourseCollection/CourseCollection';
import UserInfo from './views/UserInfo/UserInfo';
import UploadQuiz from './views/UploadQuiz/UploadQuiz';
import LearningPath from './views/LearningPath/LearningPath';

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavBar />
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, true)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route
            exact
            path="/course/upload"
            component={Auth(UploadCourse, true)}
          />
          <Route
            exact
            path="/video/upload"
            component={Auth(UploadVideo, true)}
          />

          <Route
            exact
            path="/quiz/upload"
            component={Auth(UploadQuiz, true)}
          />
          <Route
            exact
            path="/course/:id"
            component={Auth(CourseDetail, true)}
          />
          <Route
            exact
            path="/video/:videoId/:courseId"
            component={Auth(VideoPlayer, true)}
          />
          <Route
            exact
            path="/courseCollection"
            component={Auth(CourseCollection, true)}
          />
          <Route
            exact
            path="/learningPath"
            component={Auth(LearningPath, true)}
          />
          <Route
            exact
            path="/:category"
            component={Auth(LandingPage, true)}
          />
          <Route exact path="/user/:userId" component={Auth(UserInfo, true)} />
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
