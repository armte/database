/***********************************************************************************
* Class:		CS 290
* Assignment:	Database Interaction and UI
* Author:		Tommy Armstrong
* Date:			6/7/2019
* Description:	This is the client side java script file that handles the sending and 
				receiving of exercise data to and from the database server. The data is
				sent and received by GET and POST AJAX requests.
*****************************************************************************************/


document.addEventListener('DOMContentLoaded', pageActive);

function pageActive(){
	loadTable();
	enableAddRow();
}

function loadTable() {
	var req = new XMLHttpRequest();
	req.open("GET", "http://flip3.engr.oregonstate.edu:31291/", true);
	req.addEventListener('load', function(){
		if(req.status >= 200 && req.status < 400) {
			var received = req.responseText;
			console.log(received);
			var tableObj = JSON.parse(received);
			console.log(tableObj);
			displayTable(tableObj);
		}
		else {
			console.log(req.responseText);
		}
	});

	req.send(null);
}

function displayTable(tableObj) {

	var tableBody = document.getElementById("tableBody");
	tableBody.textContent = "";

	if(tableObj.length == 0){
		return;
	}
	
	var keyNames = Object.keys(tableObj[0]);
	console.log(keyNames);
	for(var i = 0; i < tableObj.length; i++) {
		var entry = document.createElement("tr");
		for(var j = 1; j < keyNames.length; j++){
			var dataCell = document.createElement("td");
			dataCell.textContent = tableObj[i][keyNames[j]];
			if(keyNames[j] == "date"){
				dataCell.textContent = dataCell.textContent.substr(0,10);
			}
			entry.appendChild(dataCell);
		}

		var deleteCell = document.createElement("td");
		const deleteButton = document.createElement("button");
		deleteButton.textContent = "Delete";
		deleteButton.value = tableObj[i].id;
		deleteButton.addEventListener("click", function(){deleteRow(deleteButton);});
		deleteCell.appendChild(deleteButton);
		entry.appendChild(deleteCell);

		var changeCell = document.createElement("td");
		const changeButton = document.createElement("button");
		changeButton.textContent = "Change";
		changeButton.value = tableObj[i].id;
		changeButton.addEventListener("click", function(){changeRow(changeButton);});
		changeCell.appendChild(changeButton);
		entry.appendChild(changeCell);

		tableBody.appendChild(entry);

	}
}//end displayTable

function enableAddRow() {
	document.getElementById("addRowBtn").addEventListener("click", function(event){
		event.preventDefault();
		var sendData = $("#form-add").serialize();
		console.log(sendData);
		var req = new XMLHttpRequest();
		req.open("POST", "http://flip3.engr.oregonstate.edu:31291/add-row", true);
		req.addEventListener('load', function() {
			if(req.status >= 200 && req.status < 400) {
				var received = req.responseText;
				console.log(received);
				var tableObj = JSON.parse(received);
				displayTable(tableObj);
			}
			else
			{
				console.log(req.responseText);
				document.getElementById("respContainer").textContent = "Failed to load";
			}
		});

		req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		req.send(sendData);

	});
}

function deleteRow(delBtn) {
	var rowId = delBtn.value;
	console.log(rowId);
	var sendData = "id="+rowId;
	console.log(sendData);
	var req = new XMLHttpRequest();
	req.open("POST", "http://flip3.engr.oregonstate.edu:31291/delete-row", true);
	req.addEventListener('load', function() {
		if(req.status >= 200 && req.status < 400) {
			var received = req.responseText;
			console.log(received);
			var tableObj = JSON.parse(received);
			displayTable(tableObj);
		}
		else
		{
			console.log(req.responseText);
			document.getElementById("respContainer").textContent = "Failed to load";
		}
	});

	req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	req.send(sendData);

}

function changeRow(changeBtn) {
	var newData = [];
	var rowId = changeBtn.value;
	const editRow = changeBtn.parentNode.parentNode;
	console.log(editRow.nodeName);
	console.log(rowId);

	var dataCells = editRow.children;
	console.log(dataCells);

	var inputName = document.createElement("input");
	inputName.type = "text";
	inputName.name = "name";
	inputName.value = dataCells[0].textContent;
	newData.push(inputName);

	var inputReps = document.createElement("input");
	inputReps.type = "number";
	inputReps.name = "reps";
	inputReps.value = dataCells[1].textContent;
	console.log(inputReps.value);
	newData.push(inputReps);

	var inputWeight = document.createElement("input");
	inputWeight.type = "number";
	inputWeight.name = "weight";
	inputWeight.value = dataCells[2].textContent;
	newData.push(inputWeight);

	var inputDate = document.createElement("input");
	inputDate.type="date";
	inputDate.name = "date";
	inputDate.value = dataCells[3].textContent.substr(0,10);
	console.log(inputDate.value);
	newData.push(inputDate);

	var inputUnit = document.createElement("input");
	inputUnit.type = "text";
	inputUnit.name = "unit";
	inputUnit.value = dataCells[4].textContent;
	newData.push(inputUnit);

	console.log(newData);

	editRow.textContent = "";
	for(var i = 0; i < newData.length; i++){
		const newTd = document.createElement("td");
		newTd.appendChild(newData[i]);
		editRow.appendChild(newTd);
	}

	var updateCell = document.createElement("td");
	const updateButton = document.createElement("button");
	updateButton.textContent = "Update";
	updateButton.value = rowId;
	updateCell.appendChild(updateButton);
	editRow.appendChild(updateCell);
	updateButton.addEventListener("click", function(){updateRow(editRow);})
}

function updateRow(edited) {
	console.log(edited);
	var collectData = {};
	var rowData = edited.children;
	
	collectData.id = rowData[5].children[0].value;
	collectData.name = rowData[0].children[0].value;
	collectData.reps = rowData[1].children[0].value;
	collectData.weight = rowData[2].children[0].value;
	collectData.date = rowData[3].children[0].value;
	collectData.unit = rowData[4].children[0].value;

	var sendData = JSON.stringify(collectData);
	console.log(sendData);
	console.log(collectData);

	var req = new XMLHttpRequest();
		req.open("POST", "http://flip3.engr.oregonstate.edu:31291/update-row", true);
		req.addEventListener('load', function() {
			if(req.status >= 200 && req.status < 400) {
				var received = req.responseText;
				console.log("Updated Data: ");
				console.log(received);
				var tableObj = JSON.parse(received);
				displayTable(tableObj);
			}
			else
			{
				console.log(req.responseText);
				document.getElementById("respContainer").textContent = "Failed to load";
			}
		});

		req.setRequestHeader('Content-Type', 'application/json');
		req.send(sendData);
}
