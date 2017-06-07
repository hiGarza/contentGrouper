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
      if (!cg.addingCG){
        cg.cgStack.push(selectedCG);
        cg.fetchContentGroups(cg.cgStack[cg.cgStack.length - 1]["Id"]);
      }
    };

    cg.addNewCG = function(){
      cg.addingCG = true;
      cg.newCG = {
        "Parent" : cg.cgStack[cg.cgStack.length - 1]["Id"],
        "GrandParent" : cg.cgStack[cg.cgStack.length - 1]["Parent"]
      };
      cg.newCGTypeList = cg.templates.find(x => x["Id"] == cg.cgStack[cg.cgStack.length - 1]["CGType"])["Childrens"];
      cg.newCG["CGType"] = cg.newCGTypeList[0];
    };

    cg.stopAddingCG = function(){
      cg.addingCG = false;
    };

    cg.changenewCGType = function(newType){
      cg.newCG["CGType"] = newType;
    };

    cg.saveNewCG = function(){
      $http.post("https://n0d9d0r79b.execute-api.us-west-1.amazonaws.com/Production/contentgroups", cg.newCG)
      .then(function(response){
        cg.newCG["Id"] = response.data["Id"];
        cg.contentGroups.push(cg.newCG);
        cg.addNewCG();
        console.log(response);
      }, function(error){console.log(error)});
    };

    cg.addingCG = false;

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
      "CGType": "root"
    }];
    cg.fetchContentGroups(cg.cgStack[cg.cgStack.length - 1]["Id"]);

  });