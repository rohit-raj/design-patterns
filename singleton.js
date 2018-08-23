var mySingleton = (function(){
    var instance;

    function init(){
        //Singleton pattern
        function pvtFunction(){
            console.log('Inside pvt Function');
        }

        var pvtVar = 'This is pvt variable';

        return {
            publicFunction : function(){
                console.log('public Function');
            },
            publicVar : 'public var',

            getPvtVar : function(){
                return pvtVar;
            },
            getPvtFunc : function(){
                return pvtFunction();
            }
        };
    };

    return {
        getInstance : function(){
            if(!instance){
                instance = init();
            }
            return instance;
        }
    };
})();

var singleA = mySingleton.getInstance();
var singleB = mySingleton.getInstance();

console.log("pvtvar ==> ", singleA.getPvtVar());
 