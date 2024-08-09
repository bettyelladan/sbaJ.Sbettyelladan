const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
  };
  
  // The provided assignment group.
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
       {
  
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500
      }
    ]
  };
  
  // The provided learner submission data.
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47
      }
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150
      }
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400
      }
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39
      }
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140
      }
    }
  ];
  
  function getLearnerData(course, ag, submissions) {
    
    function calculateLearnerScores(courseInfo, assignmentGroups, learnerSubmissions) {
      const now = new Date();
      
      // Step 1: Filter out assignments not due yet
      assignmentGroups.forEach(group => {
          group.assignments = group.assignments.filter(assignment => new Date(assignment.due_at) <= now);
      });
  
      const learnerScores = {};
  
      learnerSubmissions.forEach(submission => {
          const { learner_id, assignment_id, submission: { score } } = submission;
  
          // Find the assignment and its group
          let foundAssignment, foundGroup;
          for (const group of assignmentGroups) {
              foundAssignment = group.assignments.find(assignment => assignment.id === assignment_id);
              if (foundAssignment) {
                  foundGroup = group;
                  break;
              }
          }
  
          if (!foundAssignment) return; // Skip if assignment not found
  
          // Initialize learner entry if not already done
          if (!learnerScores[learner_id]) {
              learnerScores[learner_id] = { id: learner_id, avg: 0, totalWeightedScore: 0, totalWeightedPoints: 0 };
          }
  
          const { points_possible } = foundAssignment;
  
          // Calculate the percentage score for the assignment
          const percentageScore = (score / points_possible) * 100;
  
          // Add the assignment score to the learner's entry
          learnerScores[learner_id][assignment_id] = percentageScore;
  
          // Update the learner's weighted score total
          const weight = foundGroup.group_weight;
          learnerScores[learner_id].totalWeightedScore += score * weight;
          learnerScores[learner_id].totalWeightedPoints += points_possible * weight;
      });
  
      // Final calculation of averages
      Object.values(learnerScores).forEach(learner => {
          learner.avg = (learner.totalWeightedScore / learner.totalWeightedPoints) * 100;
          delete learner.totalWeightedScore;
          delete learner.totalWeightedPoints;
      });
  
      // Return the learner scores as an array
      return Object.values(learnerScores);
  }
  }    
       
  const courseInfo = {
    id: 1,
    name: "Mathematics 101"
  };
  
  const assignmentGroups = [
    {
      id: 1,
      name: "Homework",
      course_id: 1,
      group_weight: 0.4,
      assignments: [
        { id: 1, name: "HW1", due_at: "2024-07-01", points_possible: 100 },
        { id: 2, name: "HW2", due_at: "2024-08-01", points_possible: 100 }
      ]
    },
    {
      id: 2,
      name: "Exams",
      course_id: 1,
      group_weight: 0.6,
      assignments: [
        { id: 3, name: "Midterm", due_at: "2024-07-15", points_possible: 200 },
        { id: 4, name: "Final", due_at: "2024-08-15", points_possible: 200 }
      ]
    }
  ];
  
  const learnerSubmissions = [
    {
      learner_id: 101,
      assignment_id: 1,
      submission: { submitted_at: "2024-06-30", score: 80 }
    },
    {
      learner_id: 101,
      assignment_id: 2,
      submission: { submitted_at: "2024-07-30", score: 90 }
    },
    {
      learner_id: 101,
      assignment_id: 3,
      submission: { submitted_at: "2024-07-14", score: 180 }
    },
    {
      learner_id: 102,
      assignment_id: 1,
      submission: { submitted_at: "2024-06-30", score: 70 }
    },
    {
      learner_id: 102,
      assignment_id: 3,
      submission: { submitted_at: "2024-07-14", score: 150 }
    }
  ]
  