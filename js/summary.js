tasks = [];
users = [];


async function init() {
  await loadAllTasks();
  await includeHTML();
  // await loadData();
  renderSummaryConten();
}


// async function loadData() {
//   try {
//     tasks = JSON.parse(await getItem('tasks'));
//     users = JSON.parse(await getItem('users'));
//   } catch (e) {
//     console.error('Loading Data error:', e);
//   }
// }


let Counts = {
  toDoStatus: 0,
  inProgressStatus: 0,
  doneStatus: 0,
  awaitFeedbackStatus: 0,
  urgentPriority: 0,
  closestDueDateForUrgent: null,
};

let currentDate = new Date();
let currentTime = new Date().getHours();


function renderSummaryConten() {
  loadeCount();
  timedGreeting();
  greetUser();
}

function loadeCount() {
  countTodos(tasks);
  document.getElementById("todoCount").innerHTML = Counts.toDoStatus;
  document.getElementById("doneCount").innerHTML = Counts.doneStatus;
  document.getElementById("progressCount").innerHTML =
  Counts.inProgressStatus;
  document.getElementById("feedbackCount").innerHTML =
  Counts.awaitFeedbackStatus;
  document.getElementById("urgentCount").innerHTML = Counts.urgentPriority;
  document.getElementById("nextUrgentDate").innerHTML =
  Counts.closestDueDateForUrgent;
  document.getElementById("totalCount").innerHTML = AllTask.length;
}

function countTodos(tasks) {
  tasks.forEach((tasks) => {
    Counts[tasks.status]++;
    if (tasks.prio === "Urgent") {
      Counts.urgentPriority++;
    }

    setNextUrgentDate(tasks, Counts)
    updateDeadlineText(Counts.urgentPriority)
  });
}


function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}


function timedGreeting() {
  let greeting;

  if (currentTime >= 5 && currentTime < 12) {
    greeting = "Good morning,";
  } else if (currentTime >= 12 && currentTime < 18) {
    greeting = "Good afternoon,";
  } else if (currentTime >= 18 && currentTime < 22) {
    greeting = "Good evening,";
  } else {
    greeting = "Good night,";
  }

  document.getElementById("timedGreeting").innerHTML = greeting;
  document.getElementById("mobileTimedGreeting").innerHTML = greeting;
}

function setNextUrgentDate(task, Counts) {
  if (
    task.prio === "Urgent" &&
    (!Counts.closestDueDateForUrgent ||
      (new Date(task.dueDate) >= currentDate &&
        new Date(task.dueDate) <
        new Date(Counts.closestDueDateForUrgent)))
  ) {
    return Counts.closestDueDateForUrgent = formatDate(task.dueDate);
  }
}


function updateDeadlineText(UrgentTasksCount) {
  if (UrgentTasksCount > 0) {
    document.getElementById("nextUrgentDateText").innerHTML =
      "Upcoming Deadline";
  } else {
    document.getElementById("nextUrgentDateText").innerHTML =
      "No Upcoming Deadline";
  }
}


document.addEventListener("DOMContentLoaded", function () {
  let mobileGreetDiv = document.getElementById("mobileGreet");
  let mainContent = document.getElementById("summaryContent");
  let isMobileView = window.matchMedia("(max-width: 767.98px)").matches;
  if (isMobileView) {
    mainContent.style.display = "none";
    mobileGreetDiv.classList.add("show");
    setTimeout(function () {
      mainContent.style.display = "flex";
      mobileGreetDiv.classList.add("hidden");
    }, 700);
    setTimeout(function () {
      mobileGreetDiv.style.display = "none";
    }, 1700);
  }
});


function greetUser() {
  let isUserLoggedIn = false;
  let user = getLoggedInUser();
  if (user) {
    document.getElementById("logedinUser").innerHTML = user;
    document.getElementById("mobileLogedinUser").innerHTML = user;
    isUserLoggedIn = true;
  }
  if (isUserLoggedIn == false) {
    document.getElementById("logedinUser").innerHTML = "Guest";
    document.getElementById("mobileLogedinUser").innerHTML = "Guest";
  }
}