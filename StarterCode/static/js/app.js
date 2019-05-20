// from data.js
var tableData = data;

//add Texas datum as the 3rd entry of dataset
TexasData={
  datetime: "1/28/1996",
  city: "dallas",
  state: "tx",
  country: "us",
  shape: "star",
  durationMinutes: "5 mins.",
  comments: "Cowboys win a superbowl, that's alien!."
  };

tableData.splice(2,0,TexasData);

// selecting table body by D3
var tbody = d3.select("tbody");

// Select the filter button ID
var submit = d3.select("#filter-btn");




var cscs=['country','state','city','shape'];
var arrayDropDowns=[];
var selectCSCS=[];
init(cscs,selectCSCS);
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
    ind=selectCSCS[i].property('selectedIndex');
    filX[X]=(ind) ? arrayDropDowns[i][ind]: "";
  })
  
  // filter data based on user input DATE
  var filteredData = (inputDate) ?  tableData.filter(ufo => (ufo.datetime === inputDate)): tableData;

  // filter data based on user input CITY, COUNTRY, STATE, and/or SHAPE
  cscs.forEach(function(X){
    filteredData=(filX[X]) ? filteredData.filter(ufo =>(ufo[X] === filX[X].toLowerCase())) : filteredData;
  })

  //clear table and add FILTEREDDATS to it
  clearAddTable(filteredData);
});

// function to act on change of dropdown menus
var ip1=[]; var ip2=[];
ip1[0]=1; ip2[0]=2;
ip1[1]=2; ip2[1]=0;
ip1[2]=0; ip2[2]=1;

for (let i=0;i<3;i++){
  d3.select('#add'+cscs[i]).on("change",function(){
    arrayDropDowns[ip1[i]]=fillDropDown(cscs[i],cscs[ip1[i]],i,ip1[i]);
    arrayDropDowns[ip2[i]]=fillDropDown(cscs[i],cscs[ip2[i]],i,ip2[i]);  
  });
}


//function to evaluate the dynamic content of each dropdown
function fillDropDown(str1,str2,i,j){
  var selectedIndex=selectCSCS[i].property('selectedIndex')
  if (selectedIndex){
    //find user selected COUNTRY/STATE/CITY based on its index
    Xs=arrayDropDowns[i][selectedIndex];
    dd=findXandShift(str2,Xs,str1);
  }else{
    dd=findXandShift(str2);
  }
  //remove existing dropdown values and subsitute values based on selected COUNTRY
  document.getElementById('add'+str2).innerHTML = ""; 
  selectCSCS[j] = d3.select('#add'+str2).append('select');
  options=selectCSCS[j].selectAll('option').data(dd);
  options.enter().append('option').text(function (d) { return d; });
  return dd
}

/* clearing TABLE and adding rows to it  */
function clearAddTable(fd){
  document.getElementById('ufo-table').getElementsByTagName('tbody')[0].innerHTML = '';

  // add filtered data as table rows
  fd.forEach((x) => {
    var row = tbody.append("tr");
    Object.entries(x).forEach(([_, value]) => {
      var cell = row.append("td").text(value);
    });
  });
}

//function to reset the user selected options for COUNTRY?STATE?CITY
d3.select('#chkbox').on("change",function(){
  // d3.select("#chkbox").select('input:checked')
  if (d3.select("#chkbox").property('checked')){
    cscs.forEach(function(X){
      document.getElementById('add'+X).innerHTML = "";})
    init(cscs,selectCSCS)
    console.log("checkboxxxxxxxxxxxxxxxxx");
    var delayInMilliseconds = 1000; //1 second
    setTimeout(function() {
      d3.select('#chkbox').property('checked',false)
    }, delayInMilliseconds);
  }
})

//function to return unique string of each data column inpu X and add "ALL X" as the first elemtn to be used in X dropdown
//adding "ALL + length of X + Xs" as the default option for X dropdown, (e.g., All 35 States)
// in case of STATE and CITY,  heirachery approach is followed IF the Xm1 is called.
// For example, STATE returns all states without Xm1=country, but if Xm1 (country) exists,
// STATE only returns states from the elected COUNTRY by user.

function findXandShift(X,Xm1="",parent=""){
  //find all X instances in DATA

  //find distinct values and return the upper case for each X
  var filX,strX;
  var dataX= tableData.map(ufo => ufo[X]);

  switch (X) {
    case 'country': 
      strX='Countries';
      break;

    case 'state': 
      strX='State(s)';
      break;

    case 'city': 
      strX='Cities';
      break;

    case 'shape': 
      strX='Shapes';
      filX=Array.from(new Set(dataX)).map(x => x.toUpperCase());
      filX.unshift(`*All ${filX.length} ${strX}*`);
      break;
  }

  if (parent){
    filX=fillDropParent(parent,X,Xm1,strX);
  }else{
    filX=Array.from(new Set(dataX)).map(x => x.toUpperCase());
    filX.unshift(`*All ${filX.length} ${strX}*`)
  }
  return filX
}

// selecting the dropdown list based on selected PARENT (to be used in findXandShift) 
function fillDropParent(str1,X,Xm1,strX){
  dataX=tableData.filter(ufo => (ufo[str1]=== Xm1.toLowerCase()));
  dataX=dataX.map(ufo => ufo[X]);
  filX=Array.from(new Set(dataX)).map(x => x.toUpperCase());
  switch (X){
    case 'country':
    case 'state':
      if (str1 === 'country'){
        filX.unshift(`*${filX.length} ${strX} of ${Xm1}*`);
      }
      break;
    case 'city':
      filX.unshift(`*${filX.length} ${strX} of ${Xm1}*`);
      break;
  }
  return filX
}
//initialize by generating 4 dropdowns
function init(cscs,selectCSCS){
  //array to be filled by selected dropdown values
    cscs.forEach(function(X,i){
      arrayDropDowns[i]=findXandShift(X);
      //selectCSCS[i] = d3.select('#add'+X).append('select').on("change",function(){});
      selectCSCS[i] = d3.select('#add'+X).append('select');
      var options = selectCSCS[i].selectAll('option').data(arrayDropDowns[i]);
      options.enter().append('option').text(function (d) { return d; });
    });
}
