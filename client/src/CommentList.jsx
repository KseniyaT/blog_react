import React from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';

const CommentList = ({ comments }) => {
  const renderedComments = comments.map(comment => {
    let content;

    console.log('BBB comment.status', comment.status);

    if (comment.status === 'approved') {
      content = comment.content;
    };

    if (comment.status === 'pending') {
      content = 'This comment is awaiting moderation';
    };

    if (comment.status === 'rejected') {
      content = 'This comment has been rejected';
    };    


    return (
      <li key={comment.id}>{content}</li>
    );
  });

  return (
    <ul>
      {renderedComments}
    </ul>
  );
};

export default CommentList;