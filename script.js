var selected_person;

var total_guesses = 0;
var compas_correct_score = 0;
var user_correct_score = 0;
var compas_correct_percentage;
var user_correct_percentage;
var user_input;
var compas_input;
var user_correct;
var compas_correct;
var onlyClickOnce;

// load the data
d3.csv(
	'./data/final_data.csv',
	function(d) {
		d.age = +d.age;
		return d;
	},
	function(error, datafile) {
		if (error) throw error;

		// put the original data in csv
		data = datafile;
		console.log(data);

		// create a random person function
		randomize = function(data) {
			var randomPerson = data[Math.floor(Math.random() * data.length)];
			return randomPerson;
		};

		newPerson = function() {
			// every time that user refreshes for a new person, reset this counter (see more below)
			onlyClickOnce = 0;

			// change box opacity
			document.getElementById('big-box').setAttribute('class', 'big-box-visible');

			// remove prior "confirmation" text
			d3.select('#reveal').html(function(d, i) {
				return null;
			});

			d3.select('#userInput').html(function(d, i) {
				return null;
			});

			d3.select('#compasInput').html(function(d, i) {
				return null;
			});

			// select a random person
			selected_person = randomize(data);
			console.log(selected_person);

			d3.select('#age').html(function(d, i) {
				return (
					'<div><p><strong>' + selected_person.age + '</strong></p></div>' + '<p>The age of the defendant</p>'
				);
			});

			d3.select('#sex').html(function(d, i) {
				return (
					'<div><p><strong>' + selected_person.sex + '</strong></p></div>' + '<p>The sex of the defendant</p>'
				);
			});

			d3.select('#priors').html(function(d, i) {
				return (
					'<div><p><strong>' +
					selected_person.priors_count +
					'</strong></p></div>' +
					'<p>Prior convictions</p>'
				);
			});

			d3.select('#juvenileCount').html(function(d, i) {
				return (
					'<div><p><strong>' +
					selected_person.juv_total_count +
					'</strong></p></div>' +
					'<p>Juvenile charges</p>'
				);
			});

			d3.select('#offense').html(function(d, i) {
				return (
					'<div><p>Charge: <strong>' +
					selected_person.charge_text +
					'</strong> (' +
					selected_person.charge_degree +
					')</p></div>'
				);
			});

			d3.select('#reoffend').html(function(d, i) {
				return (
					'Is this person likely to reoffend? ' +
					'<button id="yesButton" class="inline block themedGreen" type = "button" onclick="yesFunction()">Yes!</button>' +
					'<button id="noButton" class="inline block themedRed" type = "button" onclick="noFunction()">No!</button>'
				);
			});

			yesFunction = function(d) {
				// increment only click once
				onlyClickOnce++;

				// if the user has clicked on a yes or no button more than once, ignore their input
				if (onlyClickOnce > 1) {
					null;
				} else {
					total_guesses++;

					if (selected_person.compas_guess == '1' && selected_person.compas_correct == '1') {
						user_input = 'Yes';
						compas_input = 'Yes';
						user_correct = 'Yes';
						compas_correct = 'Yes';
						// increment both correct scores
						compas_correct_score++;
						user_correct_score++;
					} else if (selected_person.compas_guess == '0' && selected_person.compas_correct == '0') {
						user_input = 'Yes';
						compas_input = 'No';
						user_correct = 'Yes';
						compas_correct = 'No';

						// increment user correct score
						user_correct_score++;
					} else if (selected_person.compas_guess == '0' && selected_person.compas_correct == '1') {
						user_input = 'Yes';
						compas_input = 'No';
						user_correct = 'No';
						compas_correct = 'Yes';

						// increment compas correct score
						compas_correct_score++;
					} else if (selected_person.compas_guess == '1' && selected_person.compas_correct == '0') {
						user_input = 'Yes';
						compas_input = 'Yes';
						user_correct = 'No';
						compas_correct = 'No';
					}

					user_correct_percentage = user_correct_score / total_guesses * 100;
					compas_correct_percentage = compas_correct_score / total_guesses * 100;

					console.log('User has ' + user_correct_score + ' correct guesses.');
					console.log('COMPAS has ' + compas_correct_score + ' correct guesses.');
					console.log('Total guesses: ' + total_guesses);
					console.log('User accuracy: ' + user_correct_percentage);
					console.log('COMPAS accuracy: ' + compas_correct_percentage);

					d3.select('#yourAccuracy').html(function(d, i) {
						if (user_correct_percentage > compas_correct_percentage) {
							return (
								Math.round(user_correct_percentage) +
								'% (' +
								user_correct_score +
								' out of ' +
								total_guesses +
								') ✅'
							);
						} else {
							return (
								Math.round(user_correct_percentage) +
								'% (' +
								user_correct_score +
								' out of ' +
								total_guesses +
								') '
							);
						}
					});

					d3.select('#compasAccuracy').html(function(d, i) {
						if (compas_correct_percentage >= user_correct_percentage) {
							return (
								Math.round(compas_correct_percentage) +
								'% (' +
								compas_correct_score +
								' out of ' +
								total_guesses +
								') ✅'
							);
						} else {
							return (
								Math.round(compas_correct_percentage) +
								'% (' +
								compas_correct_score +
								' out of ' +
								total_guesses +
								')'
							);
						}
					});

					d3.select('#userInput').html(function(d, i) {
						if (user_correct == 'Yes') {
							return '<p>Your guess: </p>' + '<div><p><strong>' + user_input + ' ✅ </strong></p></div>';
						} else {
							return '<p>Your guess: </p>' + '<div><p><strong>' + user_input + ' ❌ </strong></p></div>';
						}
					});

					d3.select('#compasInput').html(function(d, i) {
						if (compas_correct == 'Yes') {
							return (
								"<p>COMPAS's guess: </p>" + '<div><p><strong>' + compas_input + ' ✅ </strong></p></div>'
							);
						} else {
							return (
								"<p>COMPAS's guess: </p>" + '<div><p><strong>' + compas_input + ' ❌ </strong></p></div>'
							);
						}
					});

					d3.select('#reveal').html(function(d, i) {
						if (user_correct == 'Yes' && compas_correct == 'Yes') {
							return (
								'You were <strong>both right</strong>. ' +
								'<button id="submitButton" class="block inline" type = "button" onclick="newPerson()">Show me a New Defendant</button>'
							);
						} else if (user_correct == 'Yes' && compas_correct == 'No') {
							return (
								'You were <strong>right</strong> and COMPAS was <strong>wrong</strong>. ' +
								'<button id="submitButton" class="block inline" type = "button" onclick="newPerson()">Show me a New Defendant</button>'
							);
						} else if (user_correct == 'No' && compas_correct == 'Yes') {
							return (
								'You were <strong>wrong</strong> and COMPAS was <strong>right</strong>. ' +
								'<button id="submitButton" class="block inline" type = "button" onclick="newPerson()">Show me a New Defendant</button>'
							);
						} else if (user_correct == 'No' && compas_correct == 'No') {
							return (
								'You were <strong>both wrong</strong>. ' +
								'<button id="submitButton" class="block inline" type = "button" onclick="newPerson()">Show me a New Defendant</button>'
							);
						}
					});
				}
			};
		};

		noFunction = function(d) {
			// increment only click once
			onlyClickOnce++;

			// if the user has clicked on a yes or no button more than once, ignore their input
			if (onlyClickOnce > 1) {
				null;
			} else {
				total_guesses++;

				if (selected_person.compas_guess == '1' && selected_person.compas_correct == '1') {
					user_input = 'No';
					compas_input = 'Yes';
					user_correct = 'No';
					compas_correct = 'Yes';
					// increment compas correct score
					compas_correct_score++;
				} else if (selected_person.compas_guess == '0' && selected_person.compas_correct == '0') {
					user_input = 'No';
					compas_input = 'No';
					user_correct = 'No';
					compas_correct = 'No';
				} else if (selected_person.compas_guess == '0' && selected_person.compas_correct == '1') {
					user_input = 'No';
					compas_input = 'No';
					user_correct = 'Yes';
					compas_correct = 'Yes';

					//increment both scores
					compas_correct_score++;
					user_correct_score++;
				} else if (selected_person.compas_guess == '1' && selected_person.compas_correct == '0') {
					user_input = 'No';
					compas_input = 'Yes';
					user_correct = 'Yes';
					compas_correct = 'No';

					// increment user correct score
					user_correct_score++;
				}

				user_correct_percentage = user_correct_score / total_guesses * 100;
				compas_correct_percentage = compas_correct_score / total_guesses * 100;

				console.log('User has ' + user_correct_score + ' correct guesses.');
				console.log('COMPAS has ' + compas_correct_score + ' correct guesses.');
				console.log('Total guesses: ' + total_guesses);
				console.log('User accuracy: ' + user_correct_percentage);
				console.log('COMPAS accuracy: ' + compas_correct_percentage);

				d3.select('#yourAccuracy').html(function(d, i) {
					if (user_correct_percentage > compas_correct_percentage) {
						return (
							Math.round(user_correct_percentage) +
							'% (' +
							user_correct_score +
							' out of ' +
							total_guesses +
							') ✅'
						);
					} else {
						return (
							Math.round(user_correct_percentage) +
							'% (' +
							user_correct_score +
							' out of ' +
							total_guesses +
							') '
						);
					}
				});

				d3.select('#compasAccuracy').html(function(d, i) {
					if (compas_correct_percentage >= user_correct_percentage) {
						return (
							Math.round(compas_correct_percentage) +
							'% (' +
							compas_correct_score +
							' out of ' +
							total_guesses +
							') ✅'
						);
					} else {
						return (
							Math.round(compas_correct_percentage) +
							'% (' +
							compas_correct_score +
							' out of ' +
							total_guesses +
							')'
						);
					}
				});

				d3.select('#userInput').html(function(d, i) {
					if (user_correct == 'Yes') {
						return '<p>Your guess: </p>' + '<div><p><strong>' + user_input + ' ✅ </strong></p></div>';
					} else {
						return '<p>Your guess: </p>' + '<div><p><strong>' + user_input + ' ❌ </strong></p></div>';
					}
				});

				d3.select('#compasInput').html(function(d, i) {
					if (compas_correct == 'Yes') {
						return "<p>COMPAS's guess: </p>" + '<div><p><strong>' + compas_input + ' ✅ </strong></p></div>';
					} else {
						return "<p>COMPAS's guess: </p>" + '<div><p><strong>' + compas_input + ' ❌ </strong></p></div>';
					}
				});

				d3.select('#reveal').html(function(d, i) {
					if (user_correct == 'Yes' && compas_correct == 'Yes') {
						return (
							'You were <strong>both right</strong>. ' +
							'<button id="submitButton" class="block inline" type = "button" onclick="newPerson()">Show me a New Defendant</button>'
						);
					} else if (user_correct == 'Yes' && compas_correct == 'No') {
						return (
							'You were <strong>right</strong> and COMPAS was <strong>wrong</strong>. ' +
							'<button id="submitButton" class="block inline" type = "button" onclick="newPerson()">Show me a New Defendant</button>'
						);
					} else if (user_correct == 'No' && compas_correct == 'Yes') {
						return (
							'You were <strong>wrong</strong> and COMPAS was <strong>right</strong>. ' +
							'<button id="submitButton" class="block inline" type = "button" onclick="newPerson()">Show me a New Defendant</button>'
						);
					} else if (user_correct == 'No' && compas_correct == 'No') {
						return (
							'You were <strong>both wrong</strong>. ' +
							'<button id="submitButton" class="block inline" type = "button" onclick="newPerson()">Show me a New Defendant</button>'
						);
					}
				});
			}
		};
	}
);
