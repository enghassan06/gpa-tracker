// structure of semesters

let semesters = JSON.parse(localStorage.getItem("semesters")) || [];
let semesterID = 0;
let activeSemesterID;

function saveData() {
  window.localStorage.setItem("semesters", JSON.stringify(semesters));
}

function displaySemesters() {
  semesterBtnContainer.innerHTML = "";

  semesters.forEach(function (semester) {
    const semesterBtn = document.createElement("button");

    semesterBtn.classList.add("sem");

    semesterBtn.innerHTML = `
      <input type="text" class="semester-name" />

      <svg
        style="color: red; cursor: pointer"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-trash"
        viewBox="0 0 16 16"
      >
        <path
          d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
        />
        <path
          d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
        />
      </svg>
    `;

    semesterBtn.dataset.id = semester.id;

    semesterBtn.querySelector(".semester-name").value = semester.name;

    semesterBtn.addEventListener("click", function (event) {
      if (event.target.closest("svg")) {
        let id = Number(this.dataset.id);

        let index = semesters.findIndex(function (semester) {
          return semester.id === id;
        });

        semesters.splice(index, 1);

        cumulativeGpa = calculateCumulativeGpa(semesters);

        document.getElementById("cumulaative-gpa").innerHTML =
          cumulativeGpa || 0;

        saveData();
        this.remove();
        updateSemesterCount();

        return;
      }

      semesterBtnContainer.querySelectorAll(".sem").forEach(function (btn) {
        btn.classList.remove("sem-active");
      });

      activeSemesterID = Number(this.dataset.id);

      this.classList.add("sem-active");

      courseContainer.innerHTML = "";

      displayCourses(semester.courses);
    });

    semesterBtn.addEventListener("input", function () {
      semester.name = this.querySelector(".semester-name").value;

      saveData();
    });

    semesterBtnContainer.appendChild(semesterBtn);
  });
}
function updateData() {
  cumulativeGpa = calculateCumulativeGpa(semesters);

  calculateCumulativeGrade();

  document.getElementById("cumulaative-gpa").innerHTML = cumulativeGpa || 0;

  document.getElementById("cumulativeD").innerHTML = cumulativeGrade;
  let totalCredit = 0;

  semesters.forEach(function (semester) {
    totalCredit += Number(semester.totalCredits);
  });

  document.querySelectorAll("#creditsD").forEach(function (credit) {
    credit.innerHTML = totalCredit;
  });
}

function updateSemesterCount() {
  document.querySelectorAll("#semestersD").forEach(function (sem) {
    sem.innerHTML = semesters.length;
  });
}

// function to create semester

function semesterData() {
  let semester = {
    name: "",
    id: semesterID,
    courses: [],
    totalCredits: 0,
    gradeSemester: 0,
    gpa: 0,
  };

  return semester;
}

// function to create new course

function courseData() {
  let course = {
    name: "",
    credit: 0,

    midterm: 0,
    ofMidterm: 0,

    activity: 0,
    ofActivity: 0,

    project: 0,
    ofProject: 0,

    final: 0,
    ofFinal: 0,

    total: 0,
    totalCourse: 0,
    grade: 0,
    points: 0,
  };

  return course;
}

function calculateSemesterCredits(semester) {
  semester.totalCredits = 0;
  semester.courses.forEach(function (course) {
    semester.totalCredits += course.credit;
  });
}

// function to caclulate course points and grade

function calculateCourseGrade(course) {
  if (course.total / course.totalCourse >= 0.97) {
    course.grade = "A+";
    course.points = 4;
  } else if (course.total / course.totalCourse >= 0.93) {
    course.grade = "A";
    course.points = 4;
  } else if (course.total / course.totalCourse >= 0.89) {
    course.grade = "A-";
    course.points = 3.7;
  } else if (course.total / course.totalCourse >= 0.84) {
    course.grade = "B+";
    course.points = 3.3;
  } else if (course.total / course.totalCourse >= 0.8) {
    course.grade = "B";
    course.points = 3.0;
  } else if (course.total / course.totalCourse >= 0.76) {
    course.grade = "B-";
    course.points = 2.7;
  } else if (course.total / course.totalCourse >= 0.73) {
    course.grade = "C+";
    course.points = 2.3;
  } else if (course.total / course.totalCourse >= 0.7) {
    course.grade = "C";
    course.points = 2.0;
  } else if (course.total / course.totalCourse >= 0.67) {
    course.grade = "C-";
    course.points = 1.7;
  } else if (course.total / course.totalCourse >= 0.64) {
    course.grade = "D+";
    course.points = 1.3;
  } else if (course.total / course.totalCourse >= 0.6) {
    course.grade = "D";
    course.points = 1.0;
  } else if (course.total / course.totalCourse < 0.6) {
    course.grade = "F";
    course.points = 0.0;
  }
}

// function to calculate semester gpa and grade

function calculateSemesterGrade(semester) {
  let semesterPoints = 0;
  semester.courses.forEach(function (course) {
    semesterPoints += course.points * course.credit;
  });
  semester.gpa = Number((semesterPoints / semester.totalCredits).toFixed(2));

  if (semester.gpa >= 3.7) {
    semester.gradeSemester = "A+";
  } else if (semester.gpa >= 3.3) {
    semester.gradeSemester = "A-";
  } else if (semester.gpa >= 3.0) {
    semester.gradeSemester = "B+";
  } else if (semester.gpa >= 2.7) {
    semester.gradeSemester = "B";
  } else if (semester.gpa >= 2.3) {
    semester.gradeSemester = "B-";
  } else if (semester.gpa >= 2.0) {
    semester.gradeSemester = "C+";
  } else if (semester.gpa >= 1.7) {
    semester.gradeSemester = "C";
  } else if (semester.gpa >= 1.3) {
    semester.gradeSemester = "C-";
  } else if (semester.gpa >= 1.0) {
    semester.gradeSemester = "D+";
  } else if (semester.gpa > 0) {
    semester.gradeSemester = "D";
  } else if (semester.gpa === 0.0) {
    semester.gradeSemester = "F";
  }
}

// funciton to calculate cumulative gpa

let cumulativeGrade = "";
let cumulativeGpa = 0;

function calculateCumulativeGpa(semesters) {
  let totalPoints = 0;
  let totalCreditsSemester = 0;
  semesters.forEach(function (semester) {
    totalPoints += semester.gpa * semester.totalCredits;
    totalCreditsSemester += semester.totalCredits;
  });

  if (totalCreditsSemester === 0) {
    return 0;
  }

  return Number((totalPoints / totalCreditsSemester).toFixed(2));
}

function calculateCumulativeGrade() {
  if (cumulativeGpa >= 3.7) {
    cumulativeGrade = "A+";
  } else if (cumulativeGpa >= 3.3) {
    cumulativeGrade = "A-";
  } else if (cumulativeGpa >= 3.0) {
    cumulativeGrade = "B+";
  } else if (cumulativeGpa >= 2.7) {
    cumulativeGrade = "B";
  } else if (cumulativeGpa >= 2.3) {
    cumulativeGrade = "B-";
  } else if (cumulativeGpa >= 2.0) {
    cumulativeGrade = "C+";
  } else if (cumulativeGpa >= 1.7) {
    cumulativeGrade = "C";
  } else if (cumulativeGpa >= 1.3) {
    cumulativeGrade = "C-";
  } else if (cumulativeGpa >= 1.0) {
    cumulativeGrade = "D+";
  } else if (cumulativeGpa > 0) {
    cumulativeGrade = "D";
  } else if (cumulativeGpa === 0.0) {
    cumulativeGrade = "F";
  }
  return cumulativeGrade;
}

// editing nav bar in phone view

const navBar = document.querySelector("ul.phone");
const icon = document.getElementById("icon-menu");

icon.addEventListener("click", function () {
  navBar.classList.toggle("active");
  icon.firstElementChild.classList.toggle("fa-xmark");
  icon.firstElementChild.classList.toggle("fa-bars");
});

// function create new semester

const semesterBtnContainer = document.querySelector(".semeseters-btn");

function createSemester() {
  const semesterBtn = document.createElement("button");
  semesterBtn.classList.add("sem");
  semesterBtn.innerHTML = `              <input type="text" class="semester-name" />
              <svg
                style="color: red; cursor: pointer"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-trash"
                viewBox="0 0 16 16"
              >
                <path
                  d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
                />
                <path
                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
                />
              </svg>`;

  let semester = semesterData();
  semesterBtn.dataset.id = semester.id;
  semesterID++;
  semesters.push(semester);
  saveData();

  semesterBtn.addEventListener("click", function (event) {
    if (event.target.closest("svg")) {
      let id = Number(this.dataset.id);
      let index = semesters.findIndex(function (semester) {
        saveData();
        return semester.id === id;
      });
      semesters.splice(index, 1);
      cumulativeGpa = calculateCumulativeGpa(semesters);
      document.getElementById("cumulaative-gpa").innerHTML = cumulativeGpa || 0;
      this.remove();
      updateSemesterCount();
      courseContainer.innerHTML = "";
      return;
    }
    saveData();
    semesterBtnContainer.querySelectorAll(".sem").forEach(function (e) {
      e.classList.remove("sem-active");
    });
    activeSemesterID = Number(this.dataset.id);
    displayCourses(semester.courses);
    this.classList.add("sem-active");
    saveData();
  });

  semesterBtn.addEventListener("input", function () {
    semester.name = semesterBtn.querySelector(".semester-name").value;
    saveData();
  });

  return semesterBtn;
}

// event add new semester

const addSemesterBtn = document.getElementById("add-semester");

addSemesterBtn.addEventListener("click", function () {
  let semesterBtn = createSemester();
  semesterBtnContainer.appendChild(semesterBtn);
  document.querySelectorAll("#semestersD").forEach(function (sem) {
    sem.innerHTML = semesters.length;
    saveData();
  });
});

// function create new course
const courseContainer = document.querySelector(".course-container");

function createCourse() {
  const courseDiv = document.createElement("div");
  courseDiv.classList.add("course");
  courseDiv.innerHTML = `<div class="header">
            <input type="text" placeholder="New Course" class="name-course" />

            <button class="collaps-btn">
              <i class="fa-solid fa-caret-up"></i>
            </button>
          </div>
          <div class="component-wrapper">
            <div class="component-contianer">
              <table>
                <thead>
                  <tr>
                    <th>component</th>
                    <th>score</th>
                    <th>out of</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>midterm</td>
                    <td>
                      <input type="number" placeholder="0" class="mid-degree" />
                    </td>
                    <td>
                      <input
                        type="number"
                        placeholder="0"
                        class="of-mid-degree"
                      />
                    </td>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td>activities</td>
                    <td>
                      <input
                        type="number"
                        placeholder="0"
                        class="activities-degree"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        placeholder="0"
                        class="of-activities-degree"
                      />
                    </td>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td>project</td>
                    <td>
                      <input
                        type="number"
                        placeholder="0"
                        class="project-degree"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        placeholder="0"
                        class="of-project-degree"
                      />
                    </td>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td>final</td>
                    <td>
                      <input
                        type="number"
                        placeholder="0"
                        class="final-degree"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        placeholder="0"
                        class="of-final-degree"
                      />
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td>current total</td>
                    <td class="total">
                      <span class="degree total-get-degrees">-</span>
                      <span>/</span>
                      <span class="degree total-course-degrees">-</span>
                    </td>
                    <td>
                      <span>grade:</span>
                      <span class="grade-course">-</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
              <span class="credit-course"
                >credits:<input
                  type="number"
                  class="credits-of-course"
                  placeholder="credit hour"
              /></span>
              <button class="remove-course">remove course</button>
            </div>
          </div>`;

  const collapsBtn = courseDiv.querySelector(".collaps-btn i");

  collapsBtn.addEventListener("click", function () {
    collapsBtn.classList.toggle("fa-caret-up");
    collapsBtn.classList.toggle("fa-caret-down");
    courseDiv
      .querySelector(".component-wrapper")
      .classList.toggle("component-wrapper-closed");
  });

  return courseDiv;
}

// adding new course

const addCourseBtn = document.querySelector(".add-course");

addCourseBtn.addEventListener("click", function () {
  let semester = semesters.find(function (semester) {
    return semester.id === activeSemesterID;
  });

  if (!semester) {
    const errorMesage = document.createElement("div");

    errorMesage.classList.add("error");

    errorMesage.innerHTML = `<i class="fa-solid fa-circle-xmark"></i><p>Please select semester</p>`;

    courseContainer.appendChild(errorMesage);
  } else {
    let course = courseData();
    semester.courses.push(course);
    courseContainer.appendChild(createCourse());
    udateCourseData();
  }
});

courseContainer.addEventListener("click", function (event) {
  if (event.target.closest(".remove-course")) {
    let semester = semesters.find(function (semester) {
      return semester.id === activeSemesterID;
    });
    let course = event.target.closest(".course");
    let index = Array.from(courseContainer.children).indexOf(course);
    semester.courses.splice(index, 1);
    calculateSemesterCredits(semester);
    calculateSemesterGrade(semester);

    document.querySelector(".semester-gpa h2").innerHTML = semester.gpa || 0;
    document.querySelector(".semester-credits h2").innerHTML =
      semester.totalCredits;
    document.querySelector(".semester-grade h2").innerHTML =
      semester.gradeSemester;
    cumulativeGpa = calculateCumulativeGpa(semesters);
    document.getElementById("cumulaative-gpa").innerHTML = cumulativeGpa || 0;

    course.remove();
    saveData();
  }
});

// udate cousre data

function udateCourseData() {
  let semester = semesters.find(function (semester) {
    return semester.id === activeSemesterID;
  });

  courseContainer.querySelectorAll(".name-course").forEach(function (input) {
    input.addEventListener("input", function () {
      let courseElement = this.closest(".course");

      let index = Array.from(
        courseContainer.querySelectorAll(".course"),
      ).indexOf(courseElement);

      semester.courses[index].name = this.value;
      saveData();
    });
  });

  courseContainer.querySelectorAll(".mid-degree").forEach(function (input) {
    input.addEventListener("input", function () {
      let courseElement = this.closest(".course");

      let index = Array.from(
        courseContainer.querySelectorAll(".course"),
      ).indexOf(courseElement);

      semester.courses[index].midterm = this.value;

      semester.courses[index].total =
        Number(semester.courses[index].midterm) +
        Number(semester.courses[index].activity) +
        Number(semester.courses[index].project) +
        Number(semester.courses[index].final);

      courseElement.querySelector(".total-get-degrees").innerHTML =
        semester.courses[index].total;

      calculateCourseGrade(semester.courses[index]);
      calculateSemesterCredits(semester);
      calculateSemesterGrade(semester);

      cumulativeGpa = calculateCumulativeGpa(semesters);

      document.getElementById("cumulaative-gpa").innerHTML = cumulativeGpa || 0;

      let totalCredit = 0;

      semesters.forEach(function (semester) {
        totalCredit += Number(semester.totalCredits);
      });

      document.querySelectorAll("#creditsD").forEach(function (credit) {
        credit.innerHTML = totalCredit;
      });

      saveData();
    });
  });

  courseContainer.querySelectorAll(".of-mid-degree").forEach(function (input) {
    input.addEventListener("input", function () {
      let courseElement = this.closest(".course");

      let index = Array.from(
        courseContainer.querySelectorAll(".course"),
      ).indexOf(courseElement);

      semester.courses[index].ofMidterm = Number(this.value);

      semester.courses[index].totalCourse =
        Number(semester.courses[index].ofMidterm) +
        Number(semester.courses[index].ofActivity) +
        Number(semester.courses[index].ofProject) +
        Number(semester.courses[index].ofFinal);

      courseElement.querySelector(".total-course-degrees").innerHTML =
        semester.courses[index].totalCourse;

      calculateCourseGrade(semester.courses[index]);

      courseElement.querySelector(".grade-course").innerHTML =
        semester.courses[index].grade;

      saveData();
    });
  });

  courseContainer
    .querySelectorAll(".activities-degree")
    .forEach(function (input) {
      input.addEventListener("input", function () {
        let courseElement = this.closest(".course");

        let index = Array.from(
          courseContainer.querySelectorAll(".course"),
        ).indexOf(courseElement);

        semester.courses[index].activity = this.value;

        semester.courses[index].total =
          Number(semester.courses[index].midterm) +
          Number(semester.courses[index].activity) +
          Number(semester.courses[index].project) +
          Number(semester.courses[index].final);

        courseElement.querySelector(".total-get-degrees").innerHTML =
          semester.courses[index].total;

        calculateCourseGrade(semester.courses[index]);
        calculateSemesterCredits(semester);
        calculateSemesterGrade(semester);

        cumulativeGpa = calculateCumulativeGpa(semesters);

        document.getElementById("cumulaative-gpa").innerHTML =
          cumulativeGpa || 0;

        let totalCredit = 0;

        semesters.forEach(function (semester) {
          totalCredit += Number(semester.totalCredits);
        });

        document.querySelectorAll("#creditsD").forEach(function (credit) {
          credit.innerHTML = totalCredit;
        });

        saveData();
      });
    });

  courseContainer
    .querySelectorAll(".of-activities-degree")
    .forEach(function (input) {
      input.addEventListener("input", function () {
        let courseElement = this.closest(".course");

        let index = Array.from(
          courseContainer.querySelectorAll(".course"),
        ).indexOf(courseElement);

        semester.courses[index].ofActivity = Number(this.value);

        semester.courses[index].totalCourse =
          Number(semester.courses[index].ofMidterm) +
          Number(semester.courses[index].ofActivity) +
          Number(semester.courses[index].ofProject) +
          Number(semester.courses[index].ofFinal);

        courseElement.querySelector(".total-course-degrees").innerHTML =
          semester.courses[index].totalCourse;

        calculateCourseGrade(semester.courses[index]);

        courseElement.querySelector(".grade-course").innerHTML =
          semester.courses[index].grade;

        saveData();
      });
    });

  courseContainer.querySelectorAll(".project-degree").forEach(function (input) {
    input.addEventListener("input", function () {
      let courseElement = this.closest(".course");

      let index = Array.from(
        courseContainer.querySelectorAll(".course"),
      ).indexOf(courseElement);

      semester.courses[index].project = this.value;

      semester.courses[index].total =
        Number(semester.courses[index].midterm) +
        Number(semester.courses[index].activity) +
        Number(semester.courses[index].project) +
        Number(semester.courses[index].final);

      courseElement.querySelector(".total-get-degrees").innerHTML =
        semester.courses[index].total;

      calculateCourseGrade(semester.courses[index]);
      calculateSemesterCredits(semester);
      calculateSemesterGrade(semester);

      cumulativeGpa = calculateCumulativeGpa(semesters);

      document.getElementById("cumulaative-gpa").innerHTML = cumulativeGpa || 0;

      let totalCredit = 0;

      semesters.forEach(function (semester) {
        totalCredit += Number(semester.totalCredits);
      });

      document.querySelectorAll("#creditsD").forEach(function (credit) {
        credit.innerHTML = totalCredit;
      });

      saveData();
    });
  });

  courseContainer
    .querySelectorAll(".of-project-degree")
    .forEach(function (input) {
      input.addEventListener("input", function () {
        let courseElement = this.closest(".course");

        let index = Array.from(
          courseContainer.querySelectorAll(".course"),
        ).indexOf(courseElement);

        semester.courses[index].ofProject = Number(this.value);

        semester.courses[index].totalCourse =
          Number(semester.courses[index].ofMidterm) +
          Number(semester.courses[index].ofActivity) +
          Number(semester.courses[index].ofProject) +
          Number(semester.courses[index].ofFinal);

        courseElement.querySelector(".total-course-degrees").innerHTML =
          semester.courses[index].totalCourse;

        calculateCourseGrade(semester.courses[index]);

        courseElement.querySelector(".grade-course").innerHTML =
          semester.courses[index].grade;

        saveData();
      });
    });

  courseContainer.querySelectorAll(".final-degree").forEach(function (input) {
    input.addEventListener("input", function () {
      let courseElement = this.closest(".course");

      let index = Array.from(
        courseContainer.querySelectorAll(".course"),
      ).indexOf(courseElement);

      semester.courses[index].final = this.value;

      semester.courses[index].total =
        Number(semester.courses[index].midterm) +
        Number(semester.courses[index].activity) +
        Number(semester.courses[index].project) +
        Number(semester.courses[index].final);

      courseElement.querySelector(".total-get-degrees").innerHTML =
        semester.courses[index].total;

      calculateCourseGrade(semester.courses[index]);
      calculateSemesterCredits(semester);
      calculateSemesterGrade(semester);

      cumulativeGpa = calculateCumulativeGpa(semesters);

      document.getElementById("cumulaative-gpa").innerHTML = cumulativeGpa || 0;

      let totalCredit = 0;

      semesters.forEach(function (semester) {
        totalCredit += Number(semester.totalCredits);
      });

      document.querySelectorAll("#creditsD").forEach(function (credit) {
        credit.innerHTML = totalCredit;
      });

      saveData();
    });
  });

  courseContainer
    .querySelectorAll(".of-final-degree")
    .forEach(function (input) {
      input.addEventListener("input", function () {
        let courseElement = this.closest(".course");

        let index = Array.from(
          courseContainer.querySelectorAll(".course"),
        ).indexOf(courseElement);

        semester.courses[index].ofFinal = Number(this.value);

        semester.courses[index].totalCourse =
          Number(semester.courses[index].ofMidterm) +
          Number(semester.courses[index].ofActivity) +
          Number(semester.courses[index].ofProject) +
          Number(semester.courses[index].ofFinal);

        courseElement.querySelector(".total-course-degrees").innerHTML =
          semester.courses[index].totalCourse;

        calculateCourseGrade(semester.courses[index]);

        courseElement.querySelector(".grade-course").innerHTML =
          semester.courses[index].grade;

        saveData();
      });
    });

  courseContainer
    .querySelectorAll(".credits-of-course")
    .forEach(function (input) {
      input.addEventListener("input", function () {
        let courseElement = this.closest(".course");

        let index = Array.from(
          courseContainer.querySelectorAll(".course"),
        ).indexOf(courseElement);

        semester.courses[index].credit = Number(this.value);

        calculateSemesterCredits(semester);
        calculateSemesterGrade(semester);

        cumulativeGpa = calculateCumulativeGpa(semesters);

        document.getElementById("cumulaative-gpa").innerHTML =
          cumulativeGpa || 0;

        let totalCredit = 0;

        semesters.forEach(function (semester) {
          totalCredit += Number(semester.totalCredits);
        });

        document.querySelectorAll("#creditsD").forEach(function (credit) {
          credit.innerHTML = totalCredit;
        });

        saveData();
      });
    });
}
courseContainer.addEventListener("input", function (event) {
  let semester = semesters.find(function (semester) {
    return semester.id === activeSemesterID;
  });

  if (!semester) {
    return;
  }
  let courseElement = event.target.closest(".course");

  let index = Array.from(courseContainer.querySelectorAll(".course")).indexOf(
    courseElement,
  );

  semester.courses[index].totalCourse =
    Number(courseElement.querySelector(".of-mid-degree").value) +
    Number(courseElement.querySelector(".of-activities-degree").value) +
    Number(courseElement.querySelector(".of-project-degree").value) +
    Number(courseElement.querySelector(".of-final-degree").value);

  courseElement.querySelector(".total-course-degrees").innerHTML =
    semester.courses[index].totalCourse;
  calculateCourseGrade(semester.courses[index]);
  courseElement.querySelector(".grade-course").innerHTML =
    semester.courses[index].grade;
  document.querySelector(".semester-gpa h2").innerHTML = semester.gpa || 0;
  document.querySelector(".semester-credits h2").innerHTML =
    semester.totalCredits;
  document.querySelector(".semester-grade h2").innerHTML =
    semester.gradeSemester;
});

function displayCourses(courses) {
  courseContainer.innerHTML = "";
  courses.forEach(function (course) {
    const courseDiv = document.createElement("div");
    courseDiv.classList.add("course");
    courseDiv.innerHTML = `<div class="header">
            <input type="text" placeholder="New Course" class="name-course" />

            <button class="collaps-btn">
              <i class="fa-solid fa-caret-up"></i>
            </button>
          </div>
          <div class="component-wrapper">
            <div class="component-contianer">
              <table>
                <thead>
                  <tr>
                    <th>component</th>
                    <th>score</th>
                    <th>out of</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>midterm</td>
                    <td>
                      <input type="number" placeholder="0" class="mid-degree" />
                    </td>
                    <td>
                      <input
                        type="number"
                        placeholder="0"
                        class="of-mid-degree"
                      />
                    </td>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td>activities</td>
                    <td>
                      <input
                        type="number"
                        placeholder="0"
                        class="activities-degree"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        placeholder="0"
                        class="of-activities-degree"
                      />
                    </td>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td>project</td>
                    <td>
                      <input
                        type="number"
                        placeholder="0"
                        class="project-degree"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        placeholder="0"
                        class="of-project-degree"
                      />
                    </td>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td>final</td>
                    <td>
                      <input
                        type="number"
                        placeholder="0"
                        class="final-degree"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        placeholder="0"
                        class="of-final-degree"
                      />
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td>current total</td>
                    <td class="total">
                      <span class="degree total-get-degrees">-</span>
                      <span>/</span>
                      <span class="degree total-course-degrees">-</span>
                    </td>
                    <td>
                      <span>grade:</span>
                      <span class="grade-course">-</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
              <span class="credit-course"
                >credits:<input
                  type="number"
                  class="credits-of-course"
                  placeholder="credit hour"
              /></span>
              <button class="remove-course">remove course</button>
            </div>
          </div>`;
    courseDiv.querySelector(".name-course").value = course.name;

    courseDiv.querySelector(".mid-degree").value = course.midterm;

    courseDiv.querySelector(".activities-degree").value = course.activity;

    courseDiv.querySelector(".project-degree").value = course.project;

    courseDiv.querySelector(".final-degree").value = course.final;

    courseDiv.querySelector(".of-mid-degree").value = course.ofMidterm;
    courseDiv.querySelector(".of-activities-degree").value = course.ofActivity;
    courseDiv.querySelector(".of-project-degree").value = course.ofProject;
    courseDiv.querySelector(".of-final-degree").value = course.ofFinal;

    courseDiv.querySelector(".total-get-degrees").innerHTML = course.total;

    courseDiv.querySelector(".total-course-degrees").innerHTML =
      course.totalCourse;

    courseDiv.querySelector(".grade-course").innerHTML = course.grade;

    courseDiv.querySelector(".credits-of-course").value = course.credit;
    courseContainer.appendChild(courseDiv);
    const collapsBtn = courseDiv.querySelector(".collaps-btn i");

    collapsBtn.addEventListener("click", function () {
      collapsBtn.classList.toggle("fa-caret-up");
      collapsBtn.classList.toggle("fa-caret-down");
      courseDiv
        .querySelector(".component-wrapper")
        .classList.toggle("component-wrapper-closed");
    });
  });
}
displaySemesters();
updateSemesterCount();
updateData();
