function Person(name, height, mass) {
  return {
    name,
    height,
    mass,
    get bmi() {
      return this.mass / (this.height * this.height);
    }
  };
}

function highestBmi(...persons) {
  return persons.reduce((a,b) => (a.bmi > b.bmi) ? a.name : b.name);
}

let john = new Person('John', 180, 70);
let mark = new Person('Mark', 180, 80);
let jude = new Person('Jude', 200, 80);
let helen = new Person('Helen', 180, 100);

console.log(highestBmi(john, mark, jude, helen));
