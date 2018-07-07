let bills = [124, 48, 268];
console.log(tips(bills));

function tips(bills) {
  let tip = [];
  let total = [];

  for (let sum of bills) {
    if (sum < 50){
      tip.push(Math.round(sum * 0.2));
      total.push(Math.round((sum * 0.2) + sum));
    }
    else if (sum > 200){
      tip.push(Math.round(sum * 0.15));
      total.push(Math.round((sum * 0.15) + sum));
    }
    else {
      tip.push(Math.round(sum * 0.1));
      total.push(Math.round((sum * 0.1) + sum));
    }
  }

  console.log(bills);
  console.log(tip);
  console.log(total);
}
