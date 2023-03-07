const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const TEST_STRING = 'orange';

app.use(bodyParser.json());

app.post('/events', async (reg, res) => {
  const { type, data } = reg.body;

  if (type === 'CommentCreated') {
    const status = data.content.includes(TEST_STRING) ? 'rejected' : 'approved';

    await axios.post('http://localhost:4005/events', {
      type: 'CommentModerated',
      data: {
        ...data, // id, postId, content
        status,
      }
    }).catch((err) => {
      console.log(err.message);
    });
  }
});

app.listen(4003, () => {
  console.log('Listening on 4003: moderation');
});