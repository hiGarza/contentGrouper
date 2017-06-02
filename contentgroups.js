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
      var selectedCGIndex = cg.cgStack.findIndex(x => x["Id"]==cgBreadCrumb["Id"]);
      cg.cgStack = cg.cgStack.slice(0,selectedCGIndex+1);
      cg.fetchContentGroups(cg.cgStack[cg.cgStack.length - 1]["Id"]);
    };

    cg.changeCG = function(selectedCG){
      cg.cgStack.push(selectedCG);
      cg.fetchContentGroups(cg.cgStack[cg.cgStack.length - 1]["Id"]);
    };

    cg.addNewCG = function(){
      cg.newCG = {
        "Parent" : cg.cgStack[cg.cgStack.length - 1]["Id"],
        "GrandParent" : cg.cgStack[cg.cgStack.length - 1]["Parent"]
      };
      cg.newCGTypeList = cg.templates.find(x => x["Id"] == cg.cgStack[cg.cgStack.length - 1]["Type"])["Childrens"];
      cg.newCG["Type"] = cg.newCGTypeList[0];
    };

    cg.changenewCGType = function(newType){
      cg.newCG["Type"] = newType;
    };

    cg.saveNewCG = function(){
      $http.post("https://n0d9d0r79b.execute-api.us-west-1.amazonaws.com/Production/contentgroups", cg.newCG)
      .then(function(response){
        console.log(response);
      }, function(error){console.log(error)});
    };

    cg.templates = [];
    $http.get("https://n0d9d0r79b.execute-api.us-west-1.amazonaws.com/Production/contentgroups?Parent=Template")
    .then(function(response){
      cg.templates = response.data["Items"];
    }, function(error){console.log(error)});

    cg.cgStack = [{
      "Childrens": [
        "Serie",
        "Video"
      ],
      "Id": "root",
      "Name": "root",
      "Parent": "seed",
      "Type": "root"
    }];
    cg.fetchContentGroups(cg.cgStack[cg.cgStack.length - 1]["Id"]);

  });