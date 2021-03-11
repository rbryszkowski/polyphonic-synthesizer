

function copyAndUpdateObj (object, keyArr, newValue) {

}

function arrayFlatten(array) {
  let newArray = [...array];
  let hasArray = newArray.find(el => Array.isArray(el));
  while (hasArray) {
    for (let i=0;i<newArray.length;i++) {
      if ( Array.isArray(newArray[i]) ) {
        let leftArr = newArray.slice(0, i);
        let rightArr = newArray.slice(i+1);
        newArray = leftArr.concat(newArray[i]).concat(rightArr);
        i+=newArray[i].length;
      }
    }
    hasArray = newArray.find(el => Array.isArray(el));
  }
  return newArray;
}

let flatArr = arrayFlatten([1,2,3,[4,5,[6,7],8],9,10,[11,[12,[13,[14]]]]]);
console.log(flatArr);
console.log(flatArr[11]);
