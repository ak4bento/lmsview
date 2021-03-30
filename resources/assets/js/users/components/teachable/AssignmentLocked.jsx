import React from 'react';

const AssignmentLocked = () => (
  <div className="bg-white border rounded d-flex flex-column align-items-center px-3 py-5">
    <div className="text-muted display-1 mb-2"><i className="fas fa-marker"></i></div>
    <div className="text-muted h3">No more submitting!</div>
    <div className="text-muted">Your teacher is currently grading your submission. Please wait for your grade.</div>
  </div>
);

export default AssignmentLocked;