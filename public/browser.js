function template(item) {
  return `<li>
            <span class="item-text">${item.text}</span>
            <div>
              <button data-id="${item._id}" class="edit">Edit</button>
              <button data-id="${item._id}" class="delete">Delete</button>
            </div> 
          </li>`;
}

// Initial Page
let Html = items.map(function(x) {
  return template(x);
}).join('');
document.getElementById("ourList").insertAdjacentHTML("beforeend", Html);

// Create Feature
let field = document.getElementById("textField");

document.getElementById("ourForm").addEventListener("submit", function(e) {
  e.preventDefault();
  axios.post('/create-item', {text: field.value}).then(function(response) {
    // create the html for a new item
    document.getElementById("ourList").insertAdjacentHTML("beforeend", template(response.data));
    field.value = "";
    field.focus();
  }).catch(function() {
    console.log("Try again later.");
  });
});

document.addEventListener("click", function(e) {
  // Delete Feature
  if (e.target.classList.contains("delete")) {
    if (confirm("Do you really want to delete this item permanently?")) {
      axios.post('/delete-item', {id: e.target.getAttribute('data-id')}).then(function() {
        e.target.parentElement.parentElement.remove();
      }).catch(function() {
        console.log("Try again later.");
      });
    }
  }

  // Update Feature
  if (e.target.classList.contains("edit")) {
    let input = prompt("Enter text to edit", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML);
    if (input) {
      axios.post('/update-item', {text: input, id: e.target.getAttribute('data-id')}).then(function() {
        e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = input;
      }).catch(function() {
        console.log("Try again later.");
      });
    }   
  }
});
