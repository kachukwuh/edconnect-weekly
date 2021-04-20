const selectProgram = document.querySelector('#selectProgram')
const selectYears = document.querySelector('#graduationYear')
const signupButton = document.querySelector('#signupButton')

// Get Programs
const getPrograms = async () => {
  try {
    let response = await fetch('/api/programs');
    let programsList = await response.json();
    
    for(let i = 0; i < programsList.length; i++) {
      let optionEl = document.createElement('option')
      optionEl.textContent = programsList[i]
      optionEl.value = programsList[i]
      selectProgram.appendChild(optionEl) 
    }
  } catch(err) {
    console.log(err);
  }
}

// Get Projects
const getProjects = async () => {
  try {
    let response = await fetch('/api/projects');
    let projectList = await response.json();
    
    return projectList
    } catch(err) {
    console.log(err);
  }
}

// Get Graduation Years
const getGraduationYears = async () => {
  try {
    let response = await fetch('/api/graduationYears');
    let graduationYears = await response.json();
    
    for(let i = 0; i < graduationYears.length; i++) {
      let optionEl = document.createElement('option')
      optionEl.textContent = graduationYears[i]
      optionEl.value = graduationYears[i]
      selectYears.appendChild(optionEl) 
    }
  } catch(err) {
    console.log(err);
  }
}

const getCookie = async () => {
  let cookieArr = document.cookie.split(";");
  
  for(let i = 0; i < cookieArr.length; i++) {
      let cookiePair = cookieArr[i].split("=");
      
    if('uid' == cookiePair[0].trim()) {
      let response = await fetch(`/api/users/${cookiePair[1]}`)
      response = await response.json()
      return response
      // return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}

const deleteCookie = () => {
  document.cookie = "uid=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
}

if (window.location.href.includes('register.html')) {
  getPrograms()
  getGraduationYears()

  signupButton.addEventListener('click', async (e) => {
    e.preventDefault()
    let firstname = document.querySelector('#firstname').value
    let lastname = document.querySelector('#lastname').value
    let email = document.querySelector('#email').value
    let password = document.querySelector('#password').value
    let program = document.querySelector('#selectProgram').value
    let matricNumber = document.querySelector('#matricNumber').value
    let graduationYear = document.querySelector('#graduationYear').value
  
    let user = {firstname, lastname, email, password, program, matricNumber, graduationYear}
  
    let response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
  
    response = await response.json()
  
    if(response.status == 'ok') {
      document.cookie = `uid=${response.data.id};path=/`
      window.location.href = 'index.html'
    } else {
      let errors = response.errors
      let signupText = document.querySelector('#signupText')
      let divEl = document.createElement('div')
      divEl.className = 'alert alert-danger'
      errors.map((error) => {
        divEl.textContent += `\n ${error}`
        signupText.append(divEl)
      })
    }
  })
}

if (window.location.href.includes('index.html')) {
  let logoutBtn = document.querySelector('#logout')
  let username = document.querySelector('#username')
  
  window.onload = async () => {
    let user = await getCookie()
    username.textContent = `Hi, ${user.firstname}`
  }

  fetch('/api/projects')
  .then(response => response.json())
  .then(response => {
    response.map((item) => {
      let showcaseElement = document.querySelector('.showcase')
      let div = document.createElement('div')
      div.className = "card col"
      div.innerHTML = `
        <div class="card-body">
          <a href="viewproject.html?id=${item.id}" class="card-title">${item.name}</a>
          <h6 class="card-subtitle mb-2 text-muted">${item.authors}</h6>
          <p class="card-text">${item.abstract}</p>
          <a href="#" class="card-link">${item.tags}</a>
        </div>
      `
      showcaseElement.append(div)
    })
  })
  
  
  logoutBtn.addEventListener('click', (e) => {
    deleteCookie()
    window.location.href = 'index.html'
  })
}

if (window.location.href.includes('login.html')) {
  let loginForm = document.querySelector('#loginForm')

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    let email = document.querySelector('#email').value
    let password = document.querySelector('#password').value
  
    let userLogin = {email, password}

    let response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userLogin)
    })
  
    response = await response.json()
  
    if(response.status == 'ok') {
      document.cookie = `uid=${response.data.id};path=/`
      window.location.href = 'index.html'
    } else {
      let loginText = document.querySelector('#loginText')
      let divEl = document.createElement('div')
      divEl.className = 'alert alert-danger'
      divEl.textContent += 'Invalid email/password'
      loginText.append(divEl)
    }
  })
}

if (window.location.href.includes('createproject.html')) {
  window.onload = async () => {
    let cookieArr = document.cookie.split(";");
  
    for(let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        
      if(!'uid' == cookiePair[0].trim()) {
        window.location.href = 'login.html'
      }
    }
  }
  let createProjectForm = document.querySelector('#createProjectForm')

  createProjectForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    let name = document.querySelector('#name').value
    let abstract = document.querySelector('#abstract').value
    let authors = document.querySelector('#authors').value.split(',')
    let tags = document.querySelector('#tags').value.split(',')
  
    let projectDetails = {name, abstract, authors, tags}

    let response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(projectDetails)
    })
  
    response = await response.json()
    console.log(response)
    if(response.status == 'ok') {
      window.location.href = 'index.html'
    } else {
      let error = response.errors
      let projectText = document.querySelector('#projectText')
      let divEl = document.createElement('div')
      divEl.className = 'alert alert-danger'
      divEl.textContent += `${error}`
      projectText.append(divEl)
    }
  })
}

if (window.location.href.includes('viewproject.html')) {
  let id = window.location.href.split('=')[1]

  fetch(`/api/projects/${id}`)
  .then(response => response.json())
  .then(response => {
    let projectName = document.querySelector('#project_name')
    let projectAbstract = document.querySelector('#project_abstract')
    let projectAuthors = document.querySelector('#project_authors')
    let projectTags = document.querySelector('#project_tags')
    let projectAuthor = document.querySelector('#project_author')

    projectName.textContent = response.name
    projectAbstract.textContent = response.abstract
    projectAuthors.textContent = response.authors
    projectTags.textContent = response.tags
    projectAuthor.textContent = response.author

    fetch(`/api/users/${response.createdBy}`)
    .then(response => response.json())
    .then(response => {
      projectAuthor.textContent = `${response.firstname} ${response.lastname}`
    })
  })
}