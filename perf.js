// Racers
const exist = require('.');
const lodash = require('lodash');

// Data for testing
const company = function company() {
  return {
    employees: [
      {
        name: 'Benjy',
        getName() {
          return this.name;
        }
      }
    ]
  };
};

const equal = function equal(x, y) {
  return x === y;
};

const Race = require('race.js');
const marathon = new Race.Marathon();

marathon.add(new Race({
  description: 'exist VS lodash.has',

  impls: {
    'exist': exist,
    'lodash': lodash.has
  },

  inputs: [
    {
      name: 'Check existing property #1',
      values: [
        company(),
        'employees[0].name'
      ]
    },
    {
      name: 'Check existing property #2',
      values: [
        company().employees,
        '[0].name'
      ]
    },
    {
      name: 'Check non-existing property #1',
      values: [
        company(),
        'stockholders[0].name'
      ]
    },
    {
      name: 'Check non-existing property #2',
      values: [
        company().employees,
        '[1].name'
      ]
    }
  ],
  comparer: equal
}));

marathon.add(new Race({
  description: 'exist.get VS lodash.get',

  impls: {
    'exist': exist.get,
    'lodash': lodash.get
  },

  inputs: [
    {
      name: 'Get existing property #1',
      values: [
        company(),
        'employees[0].name'
      ]
    },
    {
      name: 'Get existing property #2',
      values: [
        company().employees,
        '[0].name'
      ]
    },
    {
      name: 'Get non-existing property #1',
      values: [
        company(),
        'stockholders[0].name'
      ]
    },
    {
      name: 'Get non-existing property #2',
      values: [
        company().employees,
        '[1].name'
      ]
    },
    {
      name: 'Get non-existing property with default value #1',
      values: [
        company(),
        'stockholders[0].name',
        'Benjy'
      ]
    },
    {
      name: 'Get non-existing property with default value #2',
      values: [
        company().employees,
        '[1].name',
        'Benjy'
      ]
    }
  ],
  comparer: equal
}));


// All the following codes are to print out results
const formatWinner = function formatWinner(winner) {
  return winner.impl + ' (by ' + (winner.margin * 100).toFixed(2) + '%)';
};

const Lazy = require('lazy.js');
const formatOverallWinner = function formatOverallWinner(resultGroups) {
  const winners = Lazy(resultGroups)
          .countBy(function(resultGroup) {
            return resultGroup.winner.impl;
          })
          .toObject();

  if (Object.keys(winners).length === 1) {
    return Lazy(winners).keys().first();
  }

  const breakdown = Lazy(winners)
          .map(function(count, winner) {
            return winner + ' - ' + count;
          })
          .join(', ');

  return 'mixed (' + breakdown + ')';
};

const stringTable = require('string-table');
marathon.start({
  start(race) {
    console.log('Starting "' + race.description + '" race...');
  },

  result(result) {
    console.log(' * ' + [
      result.input.name,
      result.impl,
      result.perf.toFixed(3) + ' ops/sec'
    ].join('\t'));
  },

  mismatch(outputs) {
    console.log(' * mismatch for the "' + outputs.input.name + '" case!');
  },

  complete(resultGroups) {
    console.log(' * WINNER: ' + formatOverallWinner(resultGroups));
    console.log('');
  },

  marathonComplete(resultGroups) {
    const dataObjects = Lazy(resultGroups)
            .map(function(resultGroup) {
              const dataObject = {
                'race': resultGroup.race,
                'input size': resultGroup.input.size
              };

              Lazy(resultGroup.results).each(function(perf, impl) {
                dataObject[impl] = perf;
              });

              dataObject.winner = formatWinner(resultGroup.winner);

              return dataObject;
            })
            .toArray();

    console.log(stringTable.create(dataObjects, {
      typeFormatters: {
        'number'(value) {
          return Number(value.toFixed(3));
        }
      },
      capitalizeHeaders: true
    }));
    console.log('');
  }
});
