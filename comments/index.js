const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};


app.get('/posts/:id/comments', (req, res) => {
	res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
	const commentId = randomBytes(4).toString('hex');
	const { content } = req.body;

	const comments = commentsByPostId[req.params.id] || [];

  const data = { id: commentId, content, status: 'pending' };

	comments.push(data);

	commentsByPostId[req.params.id] = comments;

  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: { 
      ...data,
      postId: req.params.id,
    },
  }).catch((err) => {
    console.log('post 4005/events error: ', err.message);
  });

	res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  if (type === 'CommentModerated') {
    const { postId, id, content, status } = data;

    const comments = commentsByPostId[postId];

    const comment = comments.find(comment => {
      return comment.id === id;
    });
    comment.status = status;

    await axios.post('http://localhost:4005/events', {
      type: 'CommentUpdated',
      data: {
        ...data, // postId, id, content
        status,
      },
    }).catch((err) => {
      console.log(err.message);
    });
  } 

  res.send({});
});

app.listen(4001, () => {
	console.log('Listening on 4001: comments');
});