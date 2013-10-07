var app = angular.module('FTD', []);

app.controller('FTD', function($scope){
	$scope.source	="I fill the dots, because dots are cool, yo!";
	
	$scope.playing		= false;
	$scope.correct 		= 0;
	$scope.incorrect 	= 0;
	$scope.nblanks 		= 0;
	$scope.items		= [];

	function hide(word)
	{
		return word.toLowerCase() === "the";
	};

	function initBlank()
	{
		return {blank: true, sequence: [], userInput: ''};
	};

	$scope.compute = function()
	{
		$scope.playing 	= true;
		$scope.items	= [];

		var words = $scope.source.split(/\s+/);
		
		var blank = undefined;

		for(var i in words)
		{
			if(blank === undefined)blank = initBlank();

			var word = words[i];

			if(hide(word))
			{
				blank.sequence.push(word);
			}
			else
			{
				var notBlank = {blank: false, word: word};
				$scope.items.push(blank);
				$scope.items.push(notBlank);
				blank = undefined;
			}

		}

		// don't forget final one if no notBlank followed (yo!)
		if(blank !== undefined)$scope.items.push(blank);

		$scope.updateScore();

	};

	$scope.updateScore = function()
	{
		$scope.correct 		= 0;
		$scope.incorrect 	= 0;
		$scope.nblanks 		= 0;

		for(var i in $scope.items)
		{
			var item = $scope.items[i];

			if(item.blank)
			{
				$scope.nblanks += item.sequence.length;

				var ok  = true;

				var input = item.userInput || '';
				
				var got = input.split(/\s+/);
				if(got.length !== item.sequence.length)
				{
					ok = false;
				}
				else for(var i in got)
				{
					if(got[i].toLowerCase() !== item.sequence[i].toLowerCase())
					{
						ok = false;
						break;
					}
				}

				if(input !== '')
				{
					if(ok)
					{
						$scope.correct += 1;
					}
					else
					{
						$scope.incorrect += 1;
					}
				}
			}
			
		}
	};

	$scope.victory = function()
	{
		return ($scope.items.length > 0) && ($scope.correct === $scope.nblanks) && ($scope.incorrect === 0);
	};

});

app.directive('contenteditable', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      // view -> model
      elm.on('blur', function() {
        scope.$apply(function() {
          ctrl.$setViewValue(elm.html());
        });
      });
 
      // model -> view
      ctrl.$render = function(value) {
        elm.html(value);
      };
 
      // load init value from DOM
      ctrl.$setViewValue(elm.html());
    }
  };
});