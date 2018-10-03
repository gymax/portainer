angular.module('portainer.app')
.controller('PluginsController', ['$scope', '$state', 'PortainerPluginService', 'Notifications',
function ($scope, $state, PortainerPluginService, Notifications) {

  $scope.state = {
    actionInProgress: false
  };

  $scope.formValues = {
    License: ''
  };

  function initView() {
    PortainerPluginService.plugins(true)
    .then(function onSuccess(data) {
      $scope.plugins = data;
    })
    .catch(function onError(err) {
      Notifications.error('Failure', err, 'Unable to access plugin store');
    });
  }

  $scope.enablePlugin = function() {
    var license = $scope.formValues.License;

    $scope.state.actionInProgress = true;
    PortainerPluginService.enable(license)
    .then(function onSuccess() {
      Notifications.success('Plugin successfully enabled');
      $state.reload();
    })
    .catch(function onError(err) {
      Notifications.error('Failure', err, 'Unable to enable plugin');
    })
    .finally(function final() {
      $scope.state.actionInProgress = false;
    });
  };


  $scope.isValidLicenseFormat = function(form) {
    var valid = true;

    if (!$scope.formValues.License) {
      return;
    }

    if (isNaN($scope.formValues.License[0])) {
      valid = false;
    }

    form.plugin_license.$setValidity('invalidLicense', valid);
  };


  initView();
}]);
