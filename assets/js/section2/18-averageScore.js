function Team(name, ...scores) {
  return {
    name,
    scores: [...scores],
    get average() {
      return this.scores.reduce((a,b) => a + b) / this.scores.length;
    }
  };
}

function highestAverage(teams) {
  return teams.reduce((a,b) => (a.average > b.average) ? a.name : b.name);
}

const teams = [
  new Team('Mike',116,94,123),
  new Team('John',89, 120, 103),
  new Team('Jannet', 130,90,101),
  new Team('Jannet2', 130,90,101)
]
console.log(highestAverage(teams));
