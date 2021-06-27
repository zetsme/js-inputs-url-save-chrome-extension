const inputBtn = document.getElementById('input-btn');
const deleteBtn = document.getElementById('deleteAll-btn');
const tabBtn = document.getElementById('tab-btn');
const inputEl = document.getElementById('input-el');
const ulEl = document.getElementById('list-el');
let myLeads = [];

inputBtn.addEventListener('click', () => {
  if (inputEl.value.trim()) {
    myLeads.push(inputEl.value);
    inputEl.value = '';
    localStorage.setItem('myLeads', JSON.stringify(myLeads));
    render(myLeads);
  }
});

tabBtn.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    myLeads.push(tabs[0].url);
    localStorage.setItem('myLeads', JSON.stringify(myLeads));
    render(myLeads);
  });
});

deleteBtn.addEventListener('dblclick', () => {
  localStorage.clear();
  myLeads = [];
  ulEl.innerHTML = '';
});

const render = (arr) => {
  let listItems = '';
  for (item of arr) {
    let text = item.startsWith('http')
      ? `<a target='_blank' href='${item}'>${item}</a>`
      : `<p>${item}</p>`;
    listItems += `<li>${text}<button id='delete-btn'>❌</button></li>`;
  }
  ulEl.innerHTML = listItems;
  document.querySelectorAll('#delete-btn').forEach((btn) => {
    btn.addEventListener('click', deleteOneLead);
  });
};

const deleteOneLead = (e) => {
  const current = e.target.closest('li').firstChild.textContent;
  myLeads = myLeads.filter((item) => item !== current);
  localStorage.setItem('myLeads', JSON.stringify(myLeads));
  render(myLeads);
};

const leadsFromLocalStorage = JSON.parse(localStorage.getItem('myLeads'));
if (leadsFromLocalStorage) {
  myLeads = leadsFromLocalStorage;
  render(myLeads);
}
