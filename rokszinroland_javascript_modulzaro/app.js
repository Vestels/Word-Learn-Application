'use sctrict'

// GET request and if the request was successfully, fills a table with the datas
function loadData() {
const apiUrl = 'https://siposm.hu/wordsAPI/getWords'
fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  })
  .then(data => {
    localStorage.setItem('wordsData', JSON.stringify(data))
    fillTable(data)
    gdprDivAlertDisplay()
    categoryCollectorAsFilterButtons(data)
    grading()
  })
  .catch(error => {
    console.error('Error:', error)
  })
}
// Fill the table with the received datas
function fillTable(data) {
    let tbody = document.querySelector('tbody')
    // Iterate over data to create rows and cells
    data.forEach(item => {
        const tr = document.createElement('tr')
        let id = item.english
        let pointsClass = "pts"
        let categoryId = item.category
        // Create cells for each item property
        const imageCell = createImageCell(item.image)
        const hungarianCell = createCell(item.hungarian.toUpperCase());
        const englishCell = createInputCell(id)
        const pointCell = createCell(item.point, pointsClass, id)   
        const categoryCell = createCell(item.category.toUpperCase(), categoryId, categoryId);
        // Append cells to the row
        tr.appendChild(imageCell)
        tr.appendChild(hungarianCell)
        tr.appendChild(englishCell)
        tr.appendChild(pointCell)
        tr.appendChild(categoryCell)
        // Append the row to the table body 
        tbody.appendChild(tr)
    })
} 
// Create a cell for the data's property
function createCell(content, cellClass, cellId, type = 'td') {
    const cell = document.createElement(type)
    cell.classList.add('align-middle', cellClass)
    cell.setAttribute('id', cellId)
    cell.textContent = content
    return cell
}
// Create a cell with an img element containing the src
function createImageCell(src) {
    const cell = document.createElement('td')
    const img = document.createElement('img')
    img.src = src
    img.alt = 'Image'
    cell.appendChild(img)
    return cell
}
// Create a cell with an input element and set the ID that belongs to it
function createInputCell(idContent) {
  const cell = document.createElement('td')
  cell.classList.add('align-middle')
  const input = document.createElement('input')
  input.type = 'text'
  input.setAttribute('id', idContent)
  cell.appendChild(input)
  return cell
}
// Button creater with onlick event that will fill an array with the sorted category and fill the table with it
function createButtonForCategory(content, data) {
  const button = document.createElement('button')
  button.classList.add('dropdown-item')
  button.textContent = content
  button.type = 'button'
  button.addEventListener('click', function() {
    const targetBody = document.getElementById('targetbody')
    // Clear table on eventlistener
    targetBody.innerHTML = ''
    // Clear grading statistics after swapping to another category
    const displayUserPts = document.getElementById('userpts')
    displayUserPts.textContent = 0
    const displayMaxPts = document.getElementById('maxpts')
    displayMaxPts.textContent = 0
    const displayPercentage = document.getElementById('percentage')
    displayPercentage.textContent = ''
    // An array with the specified category's datas
    let sortedArray = []
      for (const item of data) {
        if (button.textContent.toUpperCase() === item.category.toUpperCase()) {
          let sortedObject = {
            hungarian: item.hungarian,
            english: item.english,
            point: item.point,
            category: item.category,
            image: item.image    
          }
          sortedArray.push(sortedObject)
        }
      }
    fillTable(sortedArray)
  })
  return button
}
// appenChild the category's buttons to the dropdown-menu list
function categoryCollectorAsFilterButtons(data) {
  // Prefill an Array with data's categories
  let categories = []
  data.forEach(item => {
    const ctgName = item.category
    categories.push(ctgName)
  })
  // Remove duplicates
  let notDuplicatedCategories = [...new Set(categories)];
  // Sort alphabetically
  let sortedNotDuplicatedCategories = notDuplicatedCategories.sort()

  let ul = document.querySelector('ul')
  const clearLi = document.createElement('li')
  const clearFiltersButton = document.createElement('button')
  clearFiltersButton.classList.add('dropdown-item', 'fw-bolder', 'bg-success', 'text-light', 'py-2')
  clearFiltersButton.textContent = 'reset filters'.toUpperCase()
  clearFiltersButton.type = 'button'
  clearFiltersButton.addEventListener('click', function(){
    const targetBody = document.getElementById('targetbody')
    // Clear table on eventlistener
    targetBody.innerHTML = ''
    // Clear gradin statistics after swapping to another category
    const displayUserPts = document.getElementById('userpts')
    displayUserPts.textContent = 0
    const displayMaxPts = document.getElementById('maxpts')
    displayMaxPts.textContent = 0
    const displayPercentage = document.getElementById('percentage')
    displayPercentage.textContent = ''
    fillTable(data)
  })
  clearLi.appendChild(clearFiltersButton)
  ul.appendChild(clearLi)
  // Creates and appends the button to the drop-down list
  sortedNotDuplicatedCategories.forEach(item => {
      const li = document.createElement('li')
      const categoryName = createButtonForCategory(item.toUpperCase(), data)
      li.appendChild(categoryName)
      ul.appendChild(li)
    })
}
// Hide / Show again on page refresh the GDPR alert div depends on Accepted or Rejected
function gdprDivAlertDisplay() {
  let targetDiv = document.getElementById('gdprAlert')
  
  const acceptButton = document.getElementById('acceptbtn')
  acceptButton.addEventListener('click', function() {
  localStorage.setItem('gdprStatus', 'true')
  targetDiv.classList.remove('d-block')
  targetDiv.classList.add("d-none")
  })
  
  const rejectButton = document.getElementById('rejectbtn')
  rejectButton.addEventListener('click', function() {
  localStorage.setItem('gdprStatus', 'false')
  targetDiv.classList.remove('d-block')
  targetDiv.classList.add("d-none")
  })
  
  const statusOfGdpr = localStorage.getItem('gdprStatus')
  if (statusOfGdpr === 'true') {
      targetDiv.classList.remove('d-block')
      targetDiv.classList.add("d-none")
  } else {
  }
}
// Grading the user with points and percentage according to answers given
// Visual feedback on inputs based on answers
function grading() {
  const gradeButton = document.getElementById('gradebtn')
  gradeButton.addEventListener('click', function() {
    const targetBody = document.getElementById('targetbody')
    const inputElements = targetBody.getElementsByTagName('input')
    const pointElements = targetBody.getElementsByClassName('pts')
    let maxPoints = 0
    let userPoints = 0
    for (const item of pointElements) {
      maxPoints += Number(item.textContent)
    }
    for (let i = 0; i < inputElements.length; i++) {
      const inputId = inputElements[i].id
      let answer = inputElements[i].value

      if (inputId.toUpperCase() === answer.toUpperCase()) {
        for (const item of pointElements) {
          let pointId = item.id
          if (pointId.toUpperCase() === answer.toUpperCase()) {
            userPoints += Number(item.textContent)
          }      
        }
        // Visual feedback on input's border
        inputElements[i].classList.remove('border-danger')
        inputElements[i].classList.add('border', 'border-success', 'border-2')  
      } else {
        inputElements[i].classList.remove('border-success')
        inputElements[i].classList.add('border', 'border-danger', 'border-2')
      }
    }
    // Displays the user's calculated grade
    const displayUserPts = document.getElementById('userpts')
    displayUserPts.textContent = userPoints
    const displayMaxPts = document.getElementById('maxpts')
    displayMaxPts.textContent = maxPoints
    const displayPercentage = document.getElementById('percentage')
    displayPercentage.textContent = Math.trunc((userPoints * 100) / maxPoints) + "%"
    // If the user's achived points above 20% of maximum points then the achieved points percentage text content becomes green otherwise red
    if (userPoints < ((maxPoints / 100) * 20)) {
      displayPercentage.classList.remove('text-success')
      displayPercentage.classList.add('text-danger')
    } else {
      displayPercentage.classList.remove('text-danger')
      displayPercentage.classList.add('text-success')
      
    }
  }
  )
}

loadData()