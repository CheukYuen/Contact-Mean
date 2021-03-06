/**
 * Created by zlin on 11/10/14.
 */
angular.module('cart', []).factory('cart', function () {
    var cartData = [];
    return {
        addProduct: function (id, name, price) {
            var addedToExistingItem = false;
            for (var i = 0; i < cartData.length; i++) {
                if (cartData[i].objectId == id) {
                    cartData[i].count++;
                    addedToExistingItem = true;
                    break;
                }//if
            }//for
            if (!addedToExistingItem) {
                cartData.push({count: 1, objectId: id, price: price, name: name});
            }
        },

        removeProduct: function (id) {
            for (var i = 0; i < cartData.length; i++) {
                if (cartData[i].objectId == id) {
                    cartData.splice(i, 1);
                    break;
                }
            }
        },//function

        getProducts: function () {
            return cartData;
        },

        removeAllProduct : function(){
            cartData.length = 0;
        }
    }
}).directive('cartSummary', function (cart, $http) {
    return {
        restrict: 'E',
        templateUrl: 'cart/cartSummary.html',
        controller: function ($scope, $routeParams) {
            var cartData = cart.getProducts();

            //var cloudCartData = [];
            var currentCustomerID = $routeParams.contactId;

            //get shopping cart info
            $http.get('/api/contact/' + currentCustomerID)
                .success(function (data) {

                    $scope.currentCustomer = {
                        name: data.contact.name,
                        contactId: data.contact._id

                    };


                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });


            $scope.total = function () {
                var total = 0;
                for (var i = 0; i < cartData.length; i++) {
                    total += (cartData[i].price * cartData[i].count);
                }
                return total;
            };


            $scope.itemCount = function () {
                var total = 0;
                for (var i = 0; i < cartData.length; i++) {
                    total += cartData[i].count;
                }
                return total;
            }
        }
    };
});

