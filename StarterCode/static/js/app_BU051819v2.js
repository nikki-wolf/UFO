// from data.js
var tableData = data;

// selecting table body by D3
var tbody = d3.select("tbody");

// Select the filter button ID
var submit = d3.select("#filter-btn");

var cscs=['country','state','city','shape'];

//action on clicking FILTER TABLE button
submit.on("click", function() {

  // Prevent the page from refreshing
  d3.event.preventDefault();

  // Select the input element and get the raw HTML node
  var inputElement = d3.select("#datetime");

  // Get the value property of the input element
  var inputDate = inputElement.property("value");

  // get the CITY, STATE, SHAPE, and COUNTRY selected by user
  var filX={};
  cscs.forEach(function(X,i){
    var Xs=findXandShift(X);
    ind=selectCSCS[i].property('selectedIndex');
    filX[X]=(ind) ? Xs[ind]: "";
  })
  
  // filter data based on user input DATE
  var filteredData = (inputDate) ?  tableData.filter(ufo => (ufo.datetime === inputDate)): tableData;

  // filter data based on user input CITY, COUNTRY, STATE, and/or SHAPE
  //cscs=['city','state','country','shape'];
  cscs.forEach(function(X){
    filteredData=(filX[X]) ? filteredData.filter(ufo =>(ufo[X] === filX[X].toLowerCase())) : filteredData;
  })

  //clear table and add FILTEREDDATS to it
  clearAddTable(filteredData);
});

//generating 4 dropdowns and associated IDs
var selectCSCS=[];
cscs.forEach(function(X,i){
  dd=findXandShift(X);
  selectCSCS[i] = d3.select('#add'+X).append('select').on("change",function(){});
  var options = selectCSCS[i].selectAll('option').data(dd);
  options.enter().append('option').text(function (d) { return d; });
});

// clearing TABLE and adding rows to it
function clearAddTable(fd){
  document.getElementById('amazon-table').getElementsByTagName('tbody')[0].innerHTML = '';

  // add filtered data as table rows
  fd.forEach((x) => {
    var row = tbody.append("tr");
    Object.entries(x).forEach(([_, value]) => {
      var cell = row.append("td").text(value);
    });
  });
}

//function to return unique string of each data column inpu X and add "ALL X" as the first elemtn to be used in X dropdown
function findXandShift(X){
  //find all X in the data array
  //var dataX= tableData.map(ufo => ufo[X]);

  //find distinct values and return the upper case for each X
  //var filX=Array.from(new Set(dataX)).map(x => x.toUpperCase());

  //adding "ALL + length of X + Xs" as the default option for X dropdown, (e.g., All 35 States)

  // var strX,fil,dataX;
  // switch (X) {
  //   case 'country': 
  //   strX='Countries';
  //   dataX= tableData.map(ufo => ufo[X]);
  //   filX=Array.from(new Set(dataX)).map(x => x.toUpperCase());
  //   break;

  //   case 'state': 
  //     strX='States';
  //     dataX= tableData.map(ufo => ufo[X]);
  //     //filteredData=(filX[X]) ? filteredData.filter(ufo =>(ufo[X] === filX[X].toLowerCase())) : filteredData;
  //     var countryS=selectCSCS[0].property('selectedIndex');
  //     filX=(countryS) ? tableData.filter(ufo =>(ufo[X] === filX[X].toLowerCase())):
  //             Array.from(new Set(dataX)).map(x => x.toUpperCase());
      
  //     break;
  //   case 'city': 
  //     strX='Cities';
  //     break;
  //   case 'shape': 
  //     strX='Shapes';
  //     break;
  // }
  filX.unshift(`All ${filX.length} ${strX}`);
  
  return filX
}

