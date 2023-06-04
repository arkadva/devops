import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import './css/Page.css';

/**
 * Renders a form for inputting student details and exam scores.
 * @return {JSX.Element} The student form component.
 */
function StudentForm() {
  const [name, setName] = useState('');
  const [examScores, setExamScores] = useState([0, 0, 0]);
  const [studentData, setStudentData] = useState([]);
  const [nameError, setNameError] = useState('');
  const [scoreErrors, setScoreErrors] = useState([false, false, false]);

  useEffect(() => {
    fetch('/entries')
        .then((response) => response.json())
        .then((data) => {
          setStudentData(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const isNameValid = validateName(name);
    const areScoresValid = validateScores(examScores, setScoreErrors);

    if (!isNameValid) {
      setNameError('Name should only contain letters and spaces or be empty');
    }

    if (isNameValid && areScoresValid) {
      const studentData = {
        name: name,
        scores: examScores,
      };

      fetch('/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            // Refresh the student data by fetching the updated entries
            fetch('/entries')
                .then((response) => response.json())
                .then((data) => {
                  setStudentData(data);
                })
                .catch((error) => {
                  console.error('Error:', error);
                });
          })
          .catch((error) => {
            console.error('Error:', error);
          });

      setName('');
      setExamScores([0, 0, 0]);
      setNameError('');
      setScoreErrors([false, false, false]);
    }
  };

  const handleScoreChange = (index, value) => {
    const updatedScores = [...examScores];
    updatedScores[index] = Number(value);
    setExamScores(updatedScores);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Student Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {nameError && <span style={{color: 'red'}}>{nameError}</span>}
          </label>
        </div>
        {examScores.map((score, index) => (
          <div key={index}>
            <label>
              Exam Score {index + 1}:
              <input
                type="number"
                value={score}
                onChange={(e) => handleScoreChange(index, e.target.value)}
              />
              {scoreErrors[index] && (
                <span style={{color: 'red'}}>
                  Score should be between 0 and 100
                </span>
              )}
            </label>
          </div>
        ))}
        <button type="submit">Upload</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Exam Score 1</th>
            <th>Exam Score 2</th>
            <th>Exam Score 3</th>
          </tr>
        </thead>
        <tbody>
          {studentData.map((student, index) => (
            <tr key={index}>
              <td>{student.name}</td>
              <td>{student.score1}</td>
              <td>{student.score2}</td>
              <td>{student.score3}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Check whether or not the passed scores are valid
 * @param {Array} scores - the scores to be validated
 * @param {React.Dispatch} setScoreErrors - whether or not we should
 * update the secreen
 * @return {boolean} depending on the validity
 */
export function validateScores(scores, setScoreErrors) {
  const errors = scores.map((score) => {
    if (score < 0 || score > 100) {
      return true;
    } else {
      return false;
    }
  });

  if (setScoreErrors) {
    setScoreErrors(errors);
  }

  return !errors.includes(true);
};


/**
 * Check whether or not the passed name is valid
 * @param {string} name - the name to be validated
 * @return {boolean} depending on the validity
 */
export function validateName(name) {
  if (name.length == 0) {
    return false;
  }
  if (/[\d~`!@#$%^&*()_\-+=\[\]{}|\\:;"'<>,.?/]/.test(name)) {
    return false;
  }
  return true;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<StudentForm />);
