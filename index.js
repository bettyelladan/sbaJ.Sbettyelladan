function getLearnerData(courseInfo, assignmentGroups, learnerSubmissions, currentDate) {
    try {
        // Validate courseInfo
        if (typeof courseInfo.id !== 'number' || typeof courseInfo.name !== 'string') {
            throw new Error('Invalid CourseInfo object');
        }

        // Initialize an object to store learner data
        const learnerData = {};

        // Validate and process assignment groups
        assignmentGroups.forEach(group => {
            if (group.course_id !== courseInfo.id) {
                throw new Error(`AssignmentGroup with ID ${group.id} does not belong to the course`);
            }

            if (typeof group.group_weight !== 'number' || group.group_weight <= 0 || group.group_weight > 100) {
                throw new Error(`Invalid group weight for AssignmentGroup with ID ${group.id}`);
            }

            group.assignments.forEach(assignment => {
                if (typeof assignment.id !== 'number' ||
                    typeof assignment.name !== 'string' ||
                    typeof assignment.points_possible !== 'number' ||
                    assignment.points_possible <= 0) {
                    throw new Error(`Invalid AssignmentInfo object for Assignment with ID ${assignment.id}`);
                }
            });
        });

        // Process learner submissions
        learnerSubmissions.forEach(submission => {
            const { learner_id, assignment_id, submission: submissionDetails } = submission;

            if (typeof learner_id !== 'number' || typeof assignment_id !== 'number' ||
                typeof submissionDetails.score !== 'number' || typeof submissionDetails.submitted_at !== 'string') {
                throw new Error(`Invalid LearnerSubmission object`);
            }

            // Find the assignment group and assignment
            const assignmentGroup = assignmentGroups.find(group =>
                group.assignments.some(assignment => assignment.id === assignment_id)
            );

            if (!assignmentGroup) {
                throw new Error(`Assignment with ID ${assignment_id} not found`);
            }

            const assignment = assignmentGroup.assignments.find(a => a.id === assignment_id);

            // Skip assignments not yet due
            if (new Date(assignment.due_at) > new Date(currentDate)) {
                return;
            }

            // Calculate the score, applying a late penalty if necessary
            let score = submissionDetails.score;
            if (new Date(submissionDetails.submitted_at) > new Date(assignment.due_at)) {
                score -= assignment.points_possible * 0.10;  // Deduct 10% for late submission
            }

            if (!learnerData[learner_id]) {
                learnerData[learner_id] = {
                    id: learner_id,
                    totalScore: 0,
                    totalPoints: 0,
                    avg: 0,
                };
            }

            const learner = learnerData[learner_id];
            const percentage = (score / assignment.points_possible) * 100;

            // Add assignment percentage to learner object
            learner[assignment.id] = percentage;
            learner.totalScore += score;
            learner.totalPoints += assignment.points_possible;
        });

        // Calculate the weighted average for each learner
        return Object.values(learnerData).map(learner => {
            if (learner.totalPoints > 0) {
                learner.avg = (learner.totalScore / learner.totalPoints) * 100;
            } else {
                learner.avg = 0;
            }

            delete learner.totalScore;
            delete learner.totalPoints;
            return learner;
        });

    } catch (error) {
        console.error('Error:', error.message);
        return [];
    }
}

// Example data for testing
const courseInfo = {
    id: 1,
    name: 'Math 101',
};

const assignmentGroups = [
    {
        id: 1,
        name: 'Homework',
        course_id: 1,
        group_weight: 40,
        assignments: [
            {
                id: 101,
                name: 'Assignment 1',
                due_at: '2024-07-15',
                points_possible: 100,
            },
            {
                id: 102,
                name: 'Assignment 2',
                due_at: '2024-08-10',
                points_possible: 100,
            },
        ],
    },
];

const learnerSubmissions = [
    {
        learner_id: 1,
        assignment_id: 101,
        submission: {
            submitted_at: '2024-07-14',
            score: 90,
        },
    },
    {
        learner_id: 1,
        assignment_id: 102,
        submission: {
            submitted_at: '2024-08-11',
            score: 85,
        },
    },
];

const currentDate = '2024-08-09';

// Call the function with example data
const results = getLearnerData(courseInfo, assignmentGroups, learnerSubmissions, currentDate);
console.log(results);