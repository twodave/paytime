angular.module('crunchr.context', [])
    .service('apiService', ['$resource', '$http', function ($resource, $http) {
        var API = function (path) {
            return $resource(path, {}, { update: { method: 'PUT' }, insert: { method: 'POST' }, destroy: { method: 'DELETE' } });
        }
        this.query = function (path, model, params) {
            
            var api = new API(path);

            return api.query(params).$promise.then(function (data) {
                var result = [];
                angular.forEach(data, function (element) {
                    result.push(new model(element));
                });
                return result;
            });
        };

        this.update = function (path, params, element) {
            return new API(path).update(params, element);
        };

        this.insert = function (path, element, params) {
            return new API(path).insert(params,element);
        };

        this.destroy = function (path, params) {
            return new API(path).destroy(params);
        }
        
        this.API = API;
    }]);