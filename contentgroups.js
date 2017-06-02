angular.module('contentgroups', [])
  .controller('CGController', function($scope, $http) {
    var cg = this;

    cg.fetchContentGroups = function(cgId){
      $http.get("https://n0d9d0r79b.execute-api.us-west-1.amazonaws.com/Production/contentgroups?Parent=" + cgId)
      .then(function(response){
        cg.contentGroups = response.data["Items"];
      }, function(error){console.log(error)});
    };

    cg.breadCrumbSelect = function(cgBreadCrumb){
      console.log(cgBreadCrumb["Name"]);
      var selectedCGIndex = cg.cgStack.findIndex(x => x["Id"]==cgBreadCrumb["Id"]);
      cg.cgStack = cg.cgStack.slice(0,selectedCGIndex+1);
      cg.fetchContentGroups(cg.cgStack[cg.cgStack.length - 1]["Id"]);
    };

    cg.changeCG = function(selectedCG){
      cg.cgStack.push(selectedCG);
      cg.fetchContentGroups(cg.cgStack[cg.cgStack.length - 1]["Id"]);
    };

    cg.cgStack = [{"Parent":"seed", "Id":"root", "Name":"root"}];
    cg.fetchContentGroups(cg.cgStack[cg.cgStack.length - 1]["Id"]);

  });