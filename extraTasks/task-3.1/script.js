/*Задача 3.1. Дан массив чисел. Нужно написать функцию, которая найдет непрерывный подмассив
(содержащий как минимум одно число) с наибольшей суммой элементов и вернет эту сумму. 
Пример:  
Входной массив: [-2,1,-3,4,-1,2,1,-5,4]
Ответ: 6
Обоснование: Подмассив [4,-1,2,1] имеет наибольшую сумму элементов.*/

'use strict';

function maxSum(array) {
  let curMax = 0;
  let max = 0;
  array.forEach( el => {
    curMax = Math.max(0, curMax + el);
    max = Math.max(max, curMax);
  });
  return max;
}
console.log(maxSum([-2,1,-3,4,-1,2,1,-5,4])); 
console.log(maxSum([]));
console.log(maxSum([1,2,3,4,5]));
console.log(maxSum([1,1,1,1]));
console.log(maxSum([-100,1,-100,100,-100]));