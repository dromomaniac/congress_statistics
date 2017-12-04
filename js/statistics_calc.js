// Array of 'member' objects
var memArray = data.results[0].members;

// stores computed values
var statistics = {
  'noOfDems': 0,
  'noOfReps': 0,
  'noOfInds': 0,
  // these are here just for clarity bc created in funct
  'idsPctVotewPty': 0,  
  'repsPctVotewPty': 0, 
  'indsPctVotewPty': 0, 
  'top10MemsAtten': [], // Array of member collections
  'bot10MemsAtten': [], // Array of member collections
  'top10MemsLoyalty': [], // Array of member collections
  'bot10MemsLoyalty': [], // Array of member collections
};

// Makes list of reps, dems, and Inds. Pushes total number to statistics.noOfDems, noOfReps, noOfInds
totalMems(memArray);

getLowest10(memArray, 'votes_with_party_pct');
getHighest10(memArray, 'votes_with_party_pct');
  
getLowest10(memArray,'missed_votes_pct');
getHighest10(memArray,'missed_votes_pct');

// Make html
generateAtAGlance();

callFillFuncts(window.location.pathname.split("/"))

function callFillFuncts(windowObjectLoc) {
  let p = windowObjectLoc[2];
  if (p === 'hPartyLoyalty.html' || p === 'sPartyLoyalty.html') { 
    fillLoyal(statistics.bot10MemsLoyalty,'least-loyal-body');
    fillLoyal(statistics.top10MemsLoyalty,'most-loyal-body');
  } else if (p === 'hAttendance.html' || p === 'sAttendance.html') {
    fillAttendance(statistics.bot10MemsAtten, 'least-engaged');
    fillAttendance(statistics.top10MemsAtten, 'most-engaged');
  }
}





// Pass this an array of integers, and it finds the max value
// Reduce works by applying the function passed to it to all items in the arrayKey. First param is accumulator, 2nd is index value being evaluated
// function maxPct(arr) {  
//   var max = arr.reduce(function(a, b) {
//     return Math.max(a, b);
//   });
//   return max;
// }

// for each property/key value in each member/object, returns negative integer if b is bigger, 0 if equal, and positive integer if greater. Sort takes that number and if negative puts a in an index lower than b, keeps it in place. If sort gets positive number, it puts a in an index higher than b. So sort is taking the function's return value and using that to position the accumulator (the first parameter in function).

// does not return anything. it just sorts members in place.
function sortMemsLtoH(members, prop) {
   members.sort(function(a,b) {
    return a[prop] - b[prop];
  });
}

function sortMemsHtoL(members, prop) {
   members.sort(function(a,b) {
    return b[prop] - a[prop];
  });
}


// pass in unsorted array of member objects. 
function totalMems(members) {
  var listOfDemocrats = [];
  var listOfRepublicans = [];
  var listOfIndependents = [];
  var pctVotedWPtyDems = 0;
  
  for (let member of members) {
    switch(member.party) {
      case 'D':
        listOfDemocrats.push(member);
        break;
      case 'R':
        listOfRepublicans.push(member);
        break;
      case 'I':
        listOfIndependents.push(member);
        break;
      default:
        console.log('This statement is the default statement which would print if the switch saw none of the above cases.');      
    }
  }
  // Assign number of members in each party to key in statistics object.
  statistics.noOfDems = listOfDemocrats.length;
  statistics.noOfReps = listOfRepublicans.length;
  statistics.noOfInds = listOfIndependents.length;
  
  // Build party wide pct votes with party numbers (3 numbers)
  pctVotedWParty(listOfDemocrats,'demsPctVotewPty');
  pctVotedWParty(listOfRepublicans, 'repsPctVotewPty');
  pctVotedWParty(listOfIndependents, 'indsPctVotewPty');
  
  function pctVotedWParty(list,vwpKeyName) {
    var avgPct = 1;
    // var keyName = list + 'VotePct';
    for (let i=0;i < list.length; i++) {
      avgPct += +list[i].votes_with_party_pct;
    }
    statistics[vwpKeyName] = Math.round(avgPct/(list.length)); 
  }
}

function isATie(array, ind, prop) {
  ind = parseInt(ind);
  return (array[ind][prop] === array[ind+1][prop]);
}

  
  //Note on for...of: in ES6, it is good to use for - of loop. You can get index in for of like this:
    // for (let [index, val] of array.entries()) {
    //         // your code goes here    
// }
  // should return max value for property
  function max1(members, prop) {
    var membersCopy = members;
    return membersCopy.reduce(function(prev, current) {
      return (prev[prop] > current[prop]) ? prev[prop] : current[prop];
    });
  }

  function min1(members, prop) {
    var membersCopy = members;
    return membersCopy.reduce(function(prev, current) {
      return (prev[prop] < current[prop]) ? prev[prop] : current[prop];
    });
  }
  
  function range1(members,prop) {
    return (max1(members,prop) - min1(members,prop));
  }


  // made my own get maximum property value function. But I could have done this: [{"x":"8/11/2009","y":0.026572007},{"x":"8/12/2009","y":0.025057454},{"x":"8/13/2009","y":0.024530916},{"x":"8/14/2009","y":0.031004457}] Math.max.apply(Math,array.map(function(o){return o.y;}))  
  // or this: 
  // const max = data.reduce(function(prev, current) {
  //  return (prev.y > current.y) ? prev : current
//}) //returns object

  // Why doesn't this work?
  // function getMax(members, prop) {
  //   for (let i=1, j=members[0].prop; i < members.length; i++) {
  //     if (members[i].prop > j) {
  //       j = members[i].prop;
  //     }
  //   }
  //   return j;
  // }

  // returns array of most engaged members. Those who missed the least votes
  function getLowest10(members,prop) {
    var num = Math.floor(members.length)*0.10;
    var listOfHighest10Mems = []; // declare array
    sortMemsLtoH(members,prop);
    // const top10break = maxPct(listVtMissed)*0.9;
    // let previousMem = members[members.length-1];
    let smallSlice = members.slice(0,num);
    smallSlice.forEach(function(element, index, array) {
      listOfHighest10Mems.push(element);
    });
    
    
    let largeSlice = members.slice(num-1);
    for (let i=0; i < largeSlice.length-1; i++) {
      if ( isATie(largeSlice,i,prop) ) {
        // push next member onto top 10 list.
        listOfHighest10Mems.push(largeSlice[i+1]); 
        console.log('There was a tie for the 10th person');
      } else { 
        console.log('There was no tie for the 10th most engaged person. Breaking out of for loop');
        break;
      }
    }
    if (prop === 'votes_with_party_pct') {
      // If finding votes_with_party_pct, make key of members who voted with party the least
      statistics.bot10MemsLoyalty = listOfHighest10Mems;
    } else if (prop == 'missed_votes_pct') {
      // If finding votes_with_party_pct, make key of members who missed the least votes
      statistics.top10MemsAtten = listOfHighest10Mems;
    }
  } 


  
  // call with an array of member objects and push top 10 (and ties) only statistics.  returns array of least engaged members (those who missed the most votes).
  function getHighest10(members,prop) {
    var num = Math.floor(members.length)*0.10;
    var listOfLowest10Mems = []; // declare blank array
    sortMemsHtoL(members,prop);
    
    // I think this is not slicing right
    let smallSlice = members.slice(0,num);
    smallSlice.forEach(function(element, index, array) {
      listOfLowest10Mems.push(element);
    });
    var largeSlice = members.slice(num -1);
    console.log(largeSlice);
    for (let i=0;i < largeSlice.length-1; i++) {
      if (isATie(largeSlice, i, prop) ) {
        listOfLowest10Mems.push(largeSlice[i+1]); // push member onto top 10 list.
        console.log('There was a tie for the  person');
      } else { 
        console.log('There was no tie for the 10th least engaged person. Breaking out of for loop.');
        break;
      }  
    }
    if (prop === 'votes_with_party_pct') {
      // If finding votes_with_party_pct, make key of members who voted with party the most
      statistics.top10MemsLoyalty = listOfLowest10Mems;
    } else if (prop == 'missed_votes_pct') {
      // If finding votes_with_party_pct, make key of members who missed the most votes
      statistics.bot10MemsAtten = listOfLowest10Mems;
    }  
  }      
  // make at a glance table
  function generateAtAGlance() {
    document.getElementById(id="noOfDems").innerHTML = statistics.noOfDems;
    document.getElementById(id="demsPctVotewPty").innerHTML = statistics.demsPctVotewPty;
    
    document.getElementById(id="noOfReps").innerHTML = statistics.noOfReps;
    document.getElementById(id="repsPctVotewPty").innerHTML = statistics.repsPctVotewPty;
    
    document.getElementById(id="noOfInds").innerHTML = statistics.noOfInds;
    document.getElementById(id="indsPctVotewPty").innerHTML = statistics.indsPctVotewPty;
    
    document.getElementById(id="noOfTot").innerHTML = memArray.length;
    document.getElementById(id="totPctVotewPty").innerHTML = R.mean([statistics.demsPctVotewPty,statistics.repsPctVotewPty, statistics.indsPctVotewPty]);
  }
  
  // loop over statistics object and populate tableElement
  // for key in statistics:  
  // var no_party_votes = totalVotes * votes_with_party_pct
  // fill innerHTML with statistics.member.name,
  // fill innerHTML with statisctics.member.no_party_votes
  // fill inner HTML with statistics.member.votes_with_party_pct
  
  // populate house/senate at a glance:
  // for houseat a glance table:
  //   innerHTML = statistics.noOfDems
  
  // console.log(JSON.stringify(bottomMems, null, 4));

  // Note: For adding class: document.getElementById("div1").classList.add("classToBeAdded"); How to add a class for the div? var new_row = document.createElement('div');

  //new_row.className = "aClassName";
  // document.createElement('div').

// var new_row = document.createElement('div');

  // Populates table body. accepts an array for fields, an array for filter parameters, and a value for state
  function fillLoyal(arrayArg,idName) {
  let tbl = document.getElementById(idName);
  tbl.innerHTML = '';
    for (let mbr=0; mbr < arrayArg.length; mbr++) {
      let totPartyVotes = Math.round((arrayArg[mbr].total_votes)*(arrayArg[mbr].votes_with_party_pct)*0.01);
      // Omit middle name if it is null
      let mName = arrayArg[mbr].middle_name ? arrayArg[mbr].middle_name : '';
      let row = tbl.appendChild(document.createElement('tr'));
      let nameDataEl = '<td>' + arrayArg[mbr].first_name + ' ' + ' ' + mName + ' ' + arrayArg[mbr].last_name + '</td>';
      let numPtyVotesEl = '<td>' + totPartyVotes + '</td>';
      let pctPtyVotesEl = '<td>' + arrayArg[mbr].votes_with_party_pct + '</td>';
        row.innerHTML = nameDataEl + numPtyVotesEl + pctPtyVotesEl;
    }
  }

  function fillAttendance(arrayArg,idName) {
  let tbl = document.getElementById(idName);
  tbl.innerHTML = '';
    for (let mbr=0; mbr < arrayArg.length; mbr++) {
      let totPartyVotes = Math.round((arrayArg[mbr].total_votes)*(arrayArg[mbr].missed_votes_pct)*0.01);
      // Omit middle name if it is null
      let mName = arrayArg[mbr].middle_name ? arrayArg[mbr].middle_name : '';
      let row = tbl.appendChild(document.createElement('tr'));
      let nameDataEl = '<td>' + arrayArg[mbr].first_name + ' ' + ' ' + mName + ' ' + arrayArg[mbr].last_name + '</td>';
      let numPtyVotesEl = '<td>' + totPartyVotes + '</td>';
      let pctPtyVotesEl = '<td>' + arrayArg[mbr].missed_votes_pct + '</td>';
      row.innerHTML = nameDataEl + numPtyVotesEl + pctPtyVotesEl;
    }
  }


// Loop over the top ten and push to an object inside "statistics"

// Loop over listOfDemocrats, and for each memeber, extract the % voted with party number, add them up, then divide by the number of members.


// When statistics is populated, it can be accessed by html in the house and senate pages/data.
