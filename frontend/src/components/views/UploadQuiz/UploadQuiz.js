/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import {
  Form, Select, Input, Typography, Button, Radio, Icon,
} from 'antd';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;
const ButtonGroup = Button.Group;

const UploadQuiz = () => {
  const [courses, setCourses] = useState();
  const [course, setCourse] = useState();
  const [videos, setVideos] = useState();
  const [video, setVideo] = useState();

  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(8);

  const [questionSelected, setQuestionSelected] = useState(1);

  const [quizNumber, setQuizNumber] = useState(1);
  const [question, setQuestion] = useState();
  const [answer, setAnswer] = useState();
  const [choiceA, setChoiceA] = useState();
  const [choiceB, setChoiceB] = useState();
  const [choiceC, setChoiceC] = useState();
  const [choiceD, setChoiceD] = useState();
  const [data, setData] = useState([]);
  const [isExisted, setExisted] = useState(false);

  const onCourseChange = (value) => {
    setCourse(value);
  };

  const onVideoChange = (value) => {
    setVideo(value);
  };

  const onQuizNumberChange = (evt) => {
    setQuizNumber(evt.target.value);
  };

  const onQuestionChange = (evt) => {
    setQuestion(evt.target.value);
  };

  const onAnswerChange = (evt) => {
    setAnswer(evt.target.value);
  };

  const onChoiceChange = (choice, evt) => {
    switch (choice) {
      case 1:
        setChoiceA(evt.target.value);
        break;
      case 2:
        setChoiceB(evt.target.value);
        break;
      case 3:
        setChoiceC(evt.target.value);
        break;
      case 4:
        setChoiceD(evt.target.value);
        break;
      default:
        break;
    }
  };

  const processData = () => {
    if (course && video) {
      const dataToSubmit = {
        courseId: course,
        videoId: video,
        uploader: localStorage.userId,
        quizzes: data,
      };

      if (!question || !choiceA || !choiceB || !choiceC || !choiceD || !answer) {
        axios.post('/api/quizzes/saveQuiz', dataToSubmit).then((res) => {
          if (res.data.success) {
            console.log('Successfully save question');
          } else {
            console.log('Failed to save course');
          }
        });
      }
    }
  };

  const onSelectNextQuestion = () => {
    const quizData = {
      question,
      choices: [choiceA, choiceB, choiceC, choiceD],
      answer,
    };

    data[questionSelected - 1] = quizData;
    processData();
    setQuestionSelected(questionSelected + 1);
  };

  const onSelectBackQuestion = () => {
    const quizData = {
      question,
      choices: [choiceA, choiceB, choiceC, choiceD],
      answer,
    };

    data[questionSelected - 1] = quizData;
    processData();
    setQuestionSelected(questionSelected - 1);
  };

  const onSubmit = () => {
    if (course && video) {
      const updateData = {
        courseId: course,
        videoId: video,
        questionSelected,
        question,
        choices: [choiceA, choiceB, choiceC, choiceD],
        answer,
      };

      axios.post('/api/quizzes/updateQuiz', updateData).then((response) => {
        if (response.data.success) {
          console.log('Update data successfully');
        } else {
          console.log('Failed to update data');
        }
      });
    } else {
      alert('Select course and video first to add quizzes');
    }
  };

  // update course
  useEffect(() => {
    const courseVariables = {
      skip,
      limit,
    };
    // get course from course schema
    axios.post('/api/courses/getCourses', courseVariables).then((response) => {
      if (response.data.success) {
        setCourses(response.data.courses);
      } else {
        console.log('Failed to get courses');
      }
    });
  }, []);

  // update videos of course
  useEffect(() => {
    if (course) {
      const videoVariables = {
        courseId: course,
      };

      axios.post('/api/videos/getVideos', videoVariables).then((response) => {
        if (response.data.success) {
          setVideos(response.data.videos);
        } else {
          console.log('Failed to get videos');
        }
      });
    }
  }, [course]);

  useEffect(() => {
    if (course && video) {
      const variables = {
        courseId: course,
        videoId: video,
      };

      axios.post('/api/quizzes/getQuizzes', variables).then((response) => {
        if (response.data.success) {
          if (response.data.quiz !== undefined) {
            console.log(response.data);
            setQuestion(response.data.quiz[questionSelected - 1].question);
            setAnswer(response.data.quiz[questionSelected - 1].answer);
            setChoiceA(response.data.quiz[questionSelected - 1].choices[0]);
            setChoiceB(response.data.quiz[questionSelected - 1].choices[1]);
            setChoiceC(response.data.quiz[questionSelected - 1].choices[2]);
            setChoiceD(response.data.quiz[questionSelected - 1].choices[3]);
            setExisted(true);
          } else {
            setQuestion('');
            setAnswer('');
            setChoiceA('');
            setChoiceB('');
            setChoiceC('');
            setChoiceD('');
            setExisted(false);
          }
        }
      });
    }
  }, [course, video, quizNumber]);

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2}>Upload Quiz</Title>
        <p>Note: You have to choose course first before choosing video</p>
      </div>

      <Form>
        <label>Course:</label>
        <Select onChange={onCourseChange}>
          {courses
            && courses.map((item) => (
              <Option key={item._id} value={item._id}>
                {item.title}
              </Option>
            ))}
        </Select>
        <br />
        <br />
        <label>Video:</label>
        <Select onChange={onVideoChange}>
          {course && videos
            && videos.map((item) => (
              <Option key={item._id} value={item._id}>
                {item.title}
              </Option>
            ))}
        </Select>
        <br />
        <br />
        <p>Note: The max number of quizzes is 10</p>
        <label>Number of quizzes:</label>
        <Input type="number" required min={1} max={10} onChange={onQuizNumberChange} value={quizNumber} />
        <br />
        <br />

        <label>Fill all fields below:</label>
        <br />
        <br />
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{`Question ${questionSelected}:`}</span>
            <ButtonGroup style={{ marginBottom: '0.5rem' }}>
              <Button disabled={!(questionSelected > 1)} onClick={onSelectBackQuestion}>
                <Icon type="left" style={{ fontSize: 8 }} />
              </Button>
              <Button disabled={!(questionSelected < quizNumber)} onClick={onSelectNextQuestion}>
                <Icon type="right" style={{ fontSize: 8 }} />
              </Button>
            </ButtonGroup>
          </div>
          <Input type="text" value={question} onChange={(evt) => onQuestionChange(evt)} required />
          <br />
          <br />
          <span>Choice A: </span>
          <Input type="text" value={choiceA} onChange={(evt) => onChoiceChange(1, evt)} required />
          <br />
          <br />
          <span>Choice B: </span>
          <Input type="text" value={choiceB} onChange={(evt) => onChoiceChange(2, evt)} required />
          <br />
          <br />
          <span>Choice C: </span>
          <Input type="text" value={choiceC} onChange={(evt) => onChoiceChange(3, evt)} required />
          <br />
          <br />
          <span>Choice D: </span>
          <Input type="text" value={choiceD} onChange={(evt) => onChoiceChange(4, evt)} required />
          <br />
          <br />
          <label style={{ marginRight: '1rem' }}>Select answer for question:</label>
          <Radio.Group onChange={(evt) => onAnswerChange(evt)} value={answer}>
            <Radio value={1}>A</Radio>
            <Radio value={2}>B</Radio>
            <Radio value={3}>C</Radio>
            <Radio value={4}>D</Radio>
          </Radio.Group>
          <br />
          <br />
        </div>

        <Button size="default" onClick={onSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default UploadQuiz;
